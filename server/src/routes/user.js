import express from "express";

const app = express()
const router = express.Router();

// middleware
import { requireSignin } from "../middlewares/index.js";

// controllers
import {
  fetchCurrentUser,
  editProfile,
  editPhoneNum, 
  verifyPassword,
  changePassword,
} from "../controllers/user.js";

router.get("/getUser/:username", fetchCurrentUser);
router.post("/editProfile/:id", editProfile)
router.post("/editPhoneNum/:id", editPhoneNum)
router.post("/verifyPassword/:id", verifyPassword)
router.post("/changePassword/:id", changePassword)

export default router
