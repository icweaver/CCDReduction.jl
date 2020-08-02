var documenterSearchIndex = {"docs":
[{"location":"api/#API/Reference-1","page":"API/Reference","title":"API/Reference","text":"","category":"section"},{"location":"api/#","page":"API/Reference","title":"API/Reference","text":"For now, here is a list of all documented functions.","category":"page"},{"location":"api/#Index-1","page":"API/Reference","title":"Index","text":"","category":"section"},{"location":"api/#","page":"API/Reference","title":"API/Reference","text":"","category":"page"},{"location":"api/#API/Reference-2","page":"API/Reference","title":"API/Reference","text":"","category":"section"},{"location":"api/#","page":"API/Reference","title":"API/Reference","text":"Modules = [CCDReduction]","category":"page"},{"location":"api/#CCDReduction.arrays","page":"API/Reference","title":"CCDReduction.arrays","text":"arrays(df::DataFrame)\n\nGenerator for arrays of images of entries in data frame.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.combine-Tuple{Vararg{AbstractArray{#s12,N} where N where #s12<:Number,N} where N}","page":"API/Reference","title":"CCDReduction.combine","text":"combine(frames...; method = median)\ncombine(frames; method = median)\n\nCombine multiple frames using method. Multiple frames can also be passed in a vector or as generators for combining.\n\nTo pass a custom method, it must have a signature like method(::AbstractArray; dims).\n\nExamples\n\njulia> frame = [reshape(1.0:4.0, (2, 2)) for i = 1:4];\n\njulia> combine(frame)\n2×2 Array{Float64,2}:\n 1.0  3.0\n 2.0  4.0\n\njulia> combine(frame, method = sum)\n2×2 Array{Float64,2}:\n 4.0  12.0\n 8.0  16.0\n\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.combine-Tuple{Vararg{FITSIO.ImageHDU,N} where N}","page":"API/Reference","title":"CCDReduction.combine","text":"combine(frames...; hdu=1, kwargs...)\n\nLoad multiple FITS files or HDUs before combining. If loading from filenames, the HDU number can be specified with hdu as either an integer or a tuple corresponding to each file.\n\nLoad multiple FITS files or HDUs before combining. Filenames or HDUs can also be passed as vectors for loading before combining.\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.crop","page":"API/Reference","title":"CCDReduction.crop","text":"crop(frame::FITSIO.ImageHDU, shape; force_equal = true)\ncrop(filename::String, shape; hdu=1, force_equal = true)\n\nLoad a FITS file or HDU before cropping.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.crop-Tuple{Any,Any}","page":"API/Reference","title":"CCDReduction.crop","text":"crop(frame::AbstractArray, shape; force_equal = true)\n\nCrops frame to the size specified by shape anchored by the frame center.\n\nThis will remove rows/cols of the frame equally on each side. When there is an uneven difference in sizes (e.g. size 9 -> 6 can't be removed equally) the default is to increase the output size (e.g. 6 -> 7) so there is equal removal on each side. To disable this, set force_equal=false, which will remove the extra slice from the end of the axis.\n\nExamples\n\njulia> frame = reshape(1:25, (5, 5));\n\njulia> crop(frame, (3, 3))\n3×3 Array{Int64,2}:\n 7  12  17\n 8  13  18\n 9  14  19\n\njulia> crop(frame, (4, 3), force_equal = false)\n4×3 Array{Int64,2}:\n 6  11  16\n 7  12  17\n 8  13  18\n 9  14  19\n\n\nSee Also\n\ncropview\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.cropview-Tuple{AbstractArray,Any}","page":"API/Reference","title":"CCDReduction.cropview","text":"cropview(frame::AbstractArray, shape; force_equal = true)\n\nCrops frame to the size specified by shape anchored by the frame center.\n\nThis function is same as the crop function but returns a view of the frame.\n\nnote: Note\nThis function returns a view of the frame, so any modification to output array will result in modification of frame.\n\nSee Also\n\ncrop\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.filenames","page":"API/Reference","title":"CCDReduction.filenames","text":"filenames(df::DataFrame)\n\nGenerator for filenames of entries in data frame.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.fitscollection-Tuple{String}","page":"API/Reference","title":"CCDReduction.fitscollection","text":"fitscollection(dir; recursive=true, abspath=true, keepext=true, ext=r\"fits(\\.tar\\.gz)?\", exclude=nothing, exclude_dir=nothing, exclude_key = (\"\", \"HISTORY\"))\n\nWalk through dir collecting FITS files, scanning their headers, and culminating into a DataFrame that can be used with the generators for iterating over many files and processing them. If recursive is false, no subdirectories will be walked through.\n\nThe table returned will contain the path to the file, the name of the file, and index of the corresponding hdu, and each FITS header column and value. If two FITS files have distinct columns, they will both appear in the table with missing in the appropriate rows.\n\nIf abspath is true, the path in the table will be absolute. If keepext is true, the name in the table will include the file extension, given by ext. ext will be used with endswith to filter for fits files compatible with FITSIO.FITS. exclude is a pattern that can be used with occursin to exclude certain filenames. For example, to exclude any files containing \"sky\",\n\nfitscollection(...; exclude=\"sky\")\n\nto exclude exact filenames, regex strings will prove powerful\n\nfitscollection(...; exclude=r\"^tek001\\d\")\n\nfinally, using external tools like Glob.jl allows further customization\n\nusing Glob\nfitscollection(...; exclude=fn\"tek001*.fits\") # same as regex match above\n\nSimilarly, exclude_dir allows excluding entire folders using pattern matching (e.g. skipping a backup folder exclude_dir=\"backup\"). exclude_key allows excluding certain entries in the header unit of ImageHDU in FITS files (e.g. skipping \"HISTORY\" and \"\" exclude_key = (\"HISTORY\", \"\")).\n\nFor more information about the file matching and path deconstruction, see the extended help (??fitscollection)\n\nExtended Help\n\nParts of a path\n\nLet's look at some file paths starting from \"/data\". Here are examples of how they would be parsed\n\n root  dir   base   ext\n[----][---][------][---]\n/data/test/tek0001.fits\n\n root    dir     base   ext\n[----][-------][------][---]\n/data/test/sci/tek0001.fits\n\nIf keepext is true, name=base * ext, otherwise it is just base. If abspath is true, the path will be root * dir * base * ext, otherwise it will be dir * base * ext. These options allow flexility in creating a table that can be easily saved and loaded to avoid having to manually filter files. Especially consider how abspath can allow keeping tables that will transfer easily between computers or between data sources with common structures.\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.flat_correct","page":"API/Reference","title":"CCDReduction.flat_correct","text":"flat_correct(frame, flat_frame; [hdu=1], kwargs...)\n\nLoad frame and/or flat_frame from a given filename or FITSIO.ImageHDU. If loading from a file, you can specify the appropriate header using the hdu keyword,  which can be given as an integer or a tuple (if multiple files are being loaded). All keyword arguments will be passed to the flat_correct! function after loading the data.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.flat_correct!","page":"API/Reference","title":"CCDReduction.flat_correct!","text":"flat_correct!(frame::AbstractArray, flat_frame::FITSIO.ImageHDU; kwargs...)\nflat_correct!(frame::AbstractArray, flat_frame::String; hdu = 1, kwargs...)\n\nLoad a FITS file or HDU for the flat frame before correcting frame in-place.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.flat_correct!-Tuple{AbstractArray,AbstractArray}","page":"API/Reference","title":"CCDReduction.flat_correct!","text":"flat_correct!(frame::AbstractArray, flat_frame::AbstractArray; norm_value = mean(flat_frame))\n\nIn-place version of flat_correct\n\nSee Also\n\nflat_correct\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.flat_correct-Union{Tuple{S}, Tuple{T}, Tuple{AbstractArray{T,N} where N,AbstractArray{S,N} where N}} where S where T","page":"API/Reference","title":"CCDReduction.flat_correct","text":"flat_correct(frame::AbstractArray, flat_frame::AbstractArray; norm_value = mean(flat_frame))\n\nCorrect frame for non-uniformity using the calibrated flat_frame.\n\nBy default, the flat_frame is normalized by its mean, but this can be changed by providing a custom norm_value.\n\nnote: Note\nThis function may introduce non-finite values if flat_frame contains values very close to 0 due to dividing by zero. The default behavior will return Inf if the frame value is non-zero, and Nan if the frame value is 0.\n\nExamples\n\njulia> frame = ones(3, 3);\n\njulia> flat = fill(2.0, (3, 3));\n\njulia> flat_correct(frame, flat, norm_value = 1.0)\n3×3 Array{Float64,2}:\n 0.5  0.5  0.5\n 0.5  0.5  0.5\n 0.5  0.5  0.5\n\njulia> flat_correct(frame, flat)\n3×3 Array{Float64,2}:\n 1.0  1.0  1.0\n 1.0  1.0  1.0\n 1.0  1.0  1.0\n\n\nSee Also\n\nflat_correct!\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.images","page":"API/Reference","title":"CCDReduction.images","text":"images(df::DataFrame)\n\nGenerator for ImageHDUs of entries in data frame.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.subtract_bias","page":"API/Reference","title":"CCDReduction.subtract_bias","text":"subtract_bias(frame, bias_frame; [hdu = 1])\n\nLoad frame and/or bias_frame from a given filename or FITSIO.ImageHDU. If loading from a file, you can specify the appropriate header using the hdu keyword,  which can be given as an integer or a tuple (if multiple files are being loaded). All keyword arguments will be passed to the subtract_bias! function after loading the data.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.subtract_bias!","page":"API/Reference","title":"CCDReduction.subtract_bias!","text":"subtract_bias!(frame::AbstractArray, bias_frame::FITSIO.ImageHDU)\nsubtract_bias!(frame::AbstractArray, bias_frame::String; hdu = 1)\n\nLoad a FITS file or HDU for the bias frame before subtracting from frame in-place.\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.subtract_bias!-Tuple{AbstractArray,AbstractArray}","page":"API/Reference","title":"CCDReduction.subtract_bias!","text":"subtract_bias!(frame::AbstractArray, bias_frame::AbstractArray)\n\nIn-place version of subtract_bias\n\nSee Also\n\nsubtract_bias\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_bias-Tuple{AbstractArray,AbstractArray}","page":"API/Reference","title":"CCDReduction.subtract_bias","text":"subtract_bias(frame::AbstractArray, bias_frame::AbstractArray)\n\nSubtract the bias_frame from frame.\n\nExamples\n\njulia> frame = [1.0 2.2 3.3 4.5];\n\njulia> bias = [0.0 0.2 0.3 0.5];\n\njulia> subtract_bias(frame, bias)\n1×4 Array{Float64,2}:\n 1.0  2.0  3.0  4.0\n\n\nSee Also\n\nsubtract_bias!\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_dark!-Tuple{AbstractArray,AbstractArray}","page":"API/Reference","title":"CCDReduction.subtract_dark!","text":"subtract_dark!(frame::AbstractArray, dark_frame::AbstractArray; data_exposure = 1, dark_exposure = 1)\n\nIn-place version of subtract_dark\n\nSee Also\n\nsubtract_dark\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_dark!-Tuple{AbstractArray,FITSIO.ImageHDU}","page":"API/Reference","title":"CCDReduction.subtract_dark!","text":"subtract_dark!(frame::AbstractArray, dark_frame::FITSIO.ImageHDU; data_exposure = 1, dark_exposure = 1)\nsubtract_dark!(frame::AbstractArray, dark_frame::String; hdu = 1, data_exposure = 1, dark_exposure = 1)\n\nLoad a FITS file or HDU for the dark frame before subtracting from frame in-place. If dark_exposure is a symbol it will be parsed from the FITS header (case sensitive).\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_dark-Tuple{FITSIO.ImageHDU,AbstractArray}","page":"API/Reference","title":"CCDReduction.subtract_dark","text":"subtract_dark(frame, dark_frame; [hdu = 1], data_exposure = 1, dark_exposure = 1)\n\nSubtract the dark frame from frame. If either arguments are FITSIO.ImageHDU they will be loaded into memory. If either arguments are strings we will attempt to locate a FITS file and open it before loading the data from the given hdu. If loading multiple files, you can specify the HDU numbers separately (hdu=(1, 2)) or simultanesously (hdu=1). If data_exposure or dark_exposure is a symbol it will be read from the FITS header with that key (case sensitive).\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_dark-Union{Tuple{S}, Tuple{T}, Tuple{AbstractArray{T,N} where N,AbstractArray{S,N} where N}} where S where T","page":"API/Reference","title":"CCDReduction.subtract_dark","text":"subtract_dark(frame::AbstractArray, dark_frame::AbstractArray; data_exposure = 1, dark_exposure = 1)\n\nSubtract the dark_frame from frame.\n\nExamples\n\njulia> frame = ones(3, 3);\n\njulia> dark_frame = ones(3, 3);\n\njulia> subtract_dark(frame, dark_frame)\n3×3 Array{Float64,2}:\n 0.0  0.0  0.0\n 0.0  0.0  0.0\n 0.0  0.0  0.0\n\njulia> subtract_dark(frame, dark_frame, data_exposure = 1, dark_exposure = 4)\n3×3 Array{Float64,2}:\n 0.75  0.75  0.75\n 0.75  0.75  0.75\n 0.75  0.75  0.75\n\n\nSee Also\n\nsubtract_dark!\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_overscan","page":"API/Reference","title":"CCDReduction.subtract_overscan","text":"subtract_overscan(frame::FITSIO.ImageHDU, idxs; [dims])\nsubtract_overscan(filename::String, idxs; hdu=1, [dims])\n\nLoad a FITS file or HDU before subtracting the overscan region. If idxs is a symbol it will be read from the FITS header with that key (case sensitive).\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.subtract_overscan!-Union{Tuple{T}, Tuple{AbstractArray{T,N} where N,Any}} where T","page":"API/Reference","title":"CCDReduction.subtract_overscan!","text":"subtract_overscan!(frame::AbstractArray, idxs; dims = axes_min_length(idxs))\n\nIn-place version of subtract_overscan\n\nSee Also\n\nsubtract_overscan\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.subtract_overscan-Tuple{Any,Any}","page":"API/Reference","title":"CCDReduction.subtract_overscan","text":"subtract_overscan(frame, idxs; dims = axes_min_length(idxs))\n\nSubtract the overscan frame from image.\n\ndims is the dimension along which overscan_frame is combined. The default value of dims is the axis with smaller length in overscan region. If idxs is a string it will be parsed as FITS-style indices.\n\nExamples\n\njulia> frame = [4.0 2.0 3.0 1.0 1.0];\n\njulia> subtract_overscan(frame, (:, 4:5), dims = 2)\n1×5 Array{Float64,2}:\n 3.0  1.0  2.0  0.0  0.0\n\njulia> subtract_overscan(frame, \"[4:5, 1:1]\", dims = 2)\n1×5 Array{Float64,2}:\n 3.0  1.0  2.0  0.0  0.0\n\n\nSee Also\n\nsubtract_overscan!\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.trim","page":"API/Reference","title":"CCDReduction.trim","text":"trim(frame::FITSIO.ImageHDU, idxs)\ntrim(filename::String, idxs; hdu=1)\n\nLoad a FITS file or HDU before trimming. If idxs is a symbol it will be read from the FITS header with that key (case sensitive).\n\n\n\n\n\n","category":"function"},{"location":"api/#CCDReduction.trim-Tuple{Any,Any}","page":"API/Reference","title":"CCDReduction.trim","text":"trim(frame, idxs)\n\nTrims the frame to remove the region specified by idxs.\n\nThis function trims the array in a manner such that final array should be rectangular. The indices follow standard Julia convention, so (:, 45:60) trims all columns from 45 to 60 and (1:20, :) trims all the rows from 1 to 20. The function also supports FITS-style indices.\n\nExamples\n\njulia> frame = ones(5, 5);\n\njulia> trim(frame, (:, 2:5))\n5×1 Array{Float64,2}:\n 1.0\n 1.0\n 1.0\n 1.0\n 1.0\n\njulia> trim(frame, \"[2:5, 1:5]\")\n5×1 Array{Float64,2}:\n 1.0\n 1.0\n 1.0\n 1.0\n 1.0\n\n\nSee Also\n\ntrimview\n\n\n\n\n\n","category":"method"},{"location":"api/#CCDReduction.trimview-Tuple{AbstractArray,Any}","page":"API/Reference","title":"CCDReduction.trimview","text":"trimview(frame::AbstractArray, idxs)\n\nTrims the frame to remove the region specified by idxs.\n\nThis function is same as the trim function but returns a view of the frame.\n\nnote: Note\nThis function returns a view of the frame, so any modification to output array will result in modification of frame.\n\nSee Also\n\ntrim\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"CurrentModule = CCDReduction","category":"page"},{"location":"#CCDReduction.jl-1","page":"Home","title":"CCDReduction.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This package provides tools for basic reduction methods of CCD images.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"(Image: GitHub) (Image: Build Status) (Image: PkgEval) (Image: Codecov) (Image: License)","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"From Julia enter Pkg mode","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia>]\n\n(1.3) pkg> add CCDReduction","category":"page"},{"location":"#Usage-1","page":"Home","title":"Usage","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"You'll recognize most of the familiar reduction operations allow us to quickly and easily operate on data.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using CCDReduction\n\nnoise = randn(512, 512)\nbias_frame = reshape(1:262144, 512, 512) |> collect\nimg = reshape(1:262144, 512, 512) .+ noise\n\nsubtract_bias(img, bias_frame)\nnothing; # hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In addition to working on array-like data, we can directly load from a FITSIO.ImageHDU or from a filename","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using FITSIO\n\n# make fits file\nbias_frame = reshape(1:262144, 512, 512) |> collect\nFITS(\"master_bias.fits\", \"w\") do f\n    write(f, bias_frame)\nend\nimg = 10 .* randn(512, 512)\ndebiased = subtract_bias(img, \"master_bias.fits\")\nnothing; # hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Finally, we can use function chaining (or tools like Underscores.jl) for creating a simple processing pipeline!","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using Underscores\n\n# 5 science frames\nimgs = (10 .* randn(512, 524) for _ in 1:5)\n\n# create pipeline using Underscores.jl\npipeline(img) = @_ img |>\n    subtract_overscan(__, (:, 513:524)) |>\n    trim(__, (:, 513:524)) |>\n    subtract_bias(__, \"master_bias.fits\")\n\n# apply pipeline to images using broadcast syntax\ncalib_imgs = pipeline.(imgs)\nnothing; # hide","category":"page"},{"location":"#License-1","page":"Home","title":"License","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This work is distributed under the MIT \"expat\" license. See LICENSE for more information.","category":"page"}]
}
