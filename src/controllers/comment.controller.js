import mongoose from "mongoose";
import { Comment } from '../models/comment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!videoid) {
        throw new ApiError(400, "video id is missing")
    }
    const videoComments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoid)
            }
        },
        {
            $lookup: {
                from: "Video",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $limit: limit
        }

    ]);
    if (!videoComments?.length) {
        throw new ApiError(404, "Video comment does not exists!")
    }
    return res.status(200).json(new ApiResponse(200, videoComments[0], "Video comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {

})

const updateComment = asyncHandler(async (req, res) => {

})

const deleteComment = asyncHandler(async (req, res) => {

})


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}