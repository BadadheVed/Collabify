import { Router } from "express";
import { checkAuth } from "@/middlewares/roles";
import { authLiveblocks } from "@/controllers/liveblocks.controller";
import { UsersLive, userSearch } from "@/controllers/user.controller";
const liveblocksRouter = Router();
liveblocksRouter.post("/auth", checkAuth, authLiveblocks);
liveblocksRouter.get("/LiveUsers", UsersLive);
liveblocksRouter.get("/searchUsers", userSearch);
export default liveblocksRouter;
