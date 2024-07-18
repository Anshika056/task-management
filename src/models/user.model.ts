import mongoose, { Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/user"; 

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
},{
  timestamps: true // Add this option to include createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Instance method to compare passwords
userSchema.methods.comparePassword = function (
  candidatePassword: string,
  cb: (err: any, isMatch?: boolean) => void
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
