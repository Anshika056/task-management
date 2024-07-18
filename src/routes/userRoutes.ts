import { Router } from "express";
const router = Router();

import { logging, register } from "../controllers/user.controller";

router.post("/register",register);

router.post("/login",logging);

export default router;