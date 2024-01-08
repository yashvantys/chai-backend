import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            type: Schema.Types.owner,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.owner,
        ref: "User"
    }
},
    { timestamps: true }
)

export const Playlist = mongoose.model("Playlist", playlistSchema);
