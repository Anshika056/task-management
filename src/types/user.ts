// types/user.d.ts
import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  comparePassword(candidatePassword: string, cb: (err: any, isMatch?: boolean) => void): void;
}

export interface IUserLogin{
    email:string;
    username:string;
    password:string;
}