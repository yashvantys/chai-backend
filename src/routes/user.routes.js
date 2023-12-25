import { Router } from "express";
import { login, logout, registerUser, generateAccessTokenBasedOnRefreshToken, changeCurrentPassword, getCurrentUser, updateUser, updateUserAvatar, updateUserCoverImage, getWatchHistory, getUserChannelProfile } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(login);

// secured routes
router.route('/logout').post(verifyJWT, logout);
router.route('/generate-token').post(generateAccessTokenBasedOnRefreshToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').patch(verifyJWT, updateUser);
router.route('/update-avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router.route('/update-cover-image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage);
router.route('/channel/:username').get(verifyJWT, getUserChannelProfile);
router.route('/watch-history').get(verifyJWT, getWatchHistory);

export default router