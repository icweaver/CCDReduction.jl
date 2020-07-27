# helper functions

#=
FITSIO.jl takes over memory read in by cfitsio, which reads in row-major form,
whereas when Julia takes that memory, it is assumed as column major.
Therefore all data read by `read` is transposed.
Related comment: https://github.com/JuliaAstro/CCDReduction.jl/pull/16#issuecomment-638492572
=#
function getdata(hdu::ImageHDU)
    data = read(hdu)
    d = ndims(data)
    return permutedims(data, d:-1:1)
end

# helper function to generate default header of an image array
function get_default_header(data::AbstractArray{T}) where T <: Number
    # initial comments
    comments = ["file does conform to FITS standard", # comment for SIMPLE
                "number of bits per data pixel",      # comment for BITPIX
                "number of data axes"]                # comment for NAXIS

    hdr = OrderedDict{String, Any}() # creating OrderedDict to store header

    # Assiging SIMPLE, will be true since header is for fits file
    hdr["SIMPLE"] = true
    # Assigning BITPIX based on type
    hdr["BITPIX"] = bitpix_from_type(T)

    # Assiging NAXIS
    hdr["NAXIS"] = ndims(data)
    dims = reverse(size(data)) # reversing becuase of fits standard format
    for (i, dim) in enumerate(dims)
        str = string("NAXIS", string(i))
        hdr[str] = dim
        push!(comments, string("length of data axis ", string(i))) # Assigning comments for axis
    end

    # EXTEND is always true since no header was previously present, taken from AstroPy
    hdr["EXTEND"] = true
    push!(comments, "FITS dataset may contain extensions") # Assigning comments for EXTEND

    hdu_keys = keys(hdr) |> collect
    hdu_values = values(hdr) |> collect
    return FITSHeader(hdu_keys, hdu_values, comments)
end

#---------------------------------------------------------------------------------------
# Code generation with codegen to support path of FITS files
for func in (:flat_correct, :subtract_bias, :subtract_dark)
    @eval $func(frame::String, correction; hdu = 1, kwargs...) = $func(CCDData(frame, hdu), correction; kwargs...)
    @eval $func(frame, correction::String; hdu = 1, kwargs...) = $func(frame, CCDData(correction, hdu); kwargs...)
    @eval begin
        function $func(frame::String, correction::String; hdu = (1, 1), kwargs...)
            hdus = hdu isa Integer ? (hdu, hdu) : hdu
            return $func(CCDData(frame, hdus[1]), CCDData(frame, hdus[2]); kwargs...)
        end
    end
end

for func in (:flat_correct!, :subtract_bias!, :subtract_dark!)
    @eval $func(frame::AbstractArray, correction::String; hdu = 1, kwargs...) = $func(frame, CCDData(correction, hdu); kwargs...)
end


for func in (:crop, :trim, :subtract_overscan)
    @eval $func(frame::String, args...; hdu = 1, kwargs...) = $func(CCDData(frame, hdu), args...; kwargs...)
end

# documentation for functions interface with CCDData
"""
    subtract_bias(frame, bias_frame)

Load HDU for the `frame` or `bias_frame` as `CCDData` before subtracting from `frame`.

```julia
framefits = FITS(...) # loads FITS file
biasfits = FITS(...) # loads FITS file

frame = CCDData(framefits[1]) # loads ImageHDU of framefits as CCDData
bias = CCDData(biasfits[1]) # loads ImageHDU of biasfits as CCDData

processed_frame = subtract_bias(frame, bias) # outputs bias subtracted frame
```

Output of the function inherits the type of first parameter and header file of output (if applicable) is same as of the first parameter.
The parameters can also be of mixed type, e.g. `frame` is an `Array` and `bias_frame` is `CCDData` or vice versa.
"""
function subtract_bias end


"""
    subtract_bias!(frame, bias_frame)

Load HDU for the `frame` or `bias_frame` as `CCDData` before subtracting from `frame` in-place.
"""
function subtract_bias! end
