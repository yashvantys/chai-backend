import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body
    if ([
        fullName, email, username, password
    ].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const existingUser = User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar?.url,
        email,
        username: username.toLowerCase(),
        coverImage: coverImage?.url || "",
        password
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user')
    }
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))


})
const login = asyncHandler(async (req, res) => {
    return res.status(201).json({
        message: "ok"
    })

})


export {
    registerUser,
    login
}