import { Schema, model } from "mongoose";

import { ITask } from "../types/task";

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  author:{
    type: String,
    required: true,
  }
},{
  timestamps: true // Add this option to include createdAt and updatedAt fields
});

export default model<ITask>("Task", taskSchema);
