import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
// models
import User from "../models/user.model";
import ResponseHelper from "../helpers/responseHelpher";

// types
import { IUser , IUserLogin} from "../types/user";

/**
 * Handle user registration
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const register = async (req: Request, res: Response) => {
    const { username, password, role ,email}: IUser = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.response({
                res,
                code: 400,
                success: false,
                message: "Failed",
                data: {},
            });
        }

        const userObj = new User({
            username,
            password,
            role,
            email
        });
        let userData = await userObj.save();

        return ResponseHelper.response({
            res,
            code: 201,
            success: true,
            message: "User registered!",
            data: userData,
        });
    } catch (error) {
        return ResponseHelper.error({ res, err: error });
    }
};


/**
 * Handle user login
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const logging = async (req: Request, res: Response) => {
    try {
        const { email, password }: IUserLogin = req.body;
        if(!email || !password){
            return ResponseHelper.response({
            res,
            code: 400,
            success: false,
            message: "email and password are required",
            data: {},
        });}
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.response({
                res,
                code: 400,
                success: false,
                message: "Validation failed",
                data: { errors: errors.array() },
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return ResponseHelper.response({
                res,
                code: 404,
                success: false,
                message: "Email is invalid",
                data: {},
            });
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
              return ResponseHelper.response({
                res,
                code: 400,
                success: false,
                message: "Password is invalid",
                data: {},
              });
            }
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET!
            );

            return ResponseHelper.response({
                res,
                code: 200,
                success: true,
                message: "Login successful",
                data: { token, user: { name: user.username, role: user.role } },
            });
        });
    } catch (error) {
        return ResponseHelper.error({ res, err: error });
    }
};

