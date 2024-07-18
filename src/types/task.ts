import { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  ownerId: Schema.Types.ObjectId;
  author: string;
}


