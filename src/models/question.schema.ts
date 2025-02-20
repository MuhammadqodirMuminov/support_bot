import mongoose, { model, Schema, Types } from 'mongoose';
import { fileSchema } from './file.schema';

export interface IQuestion {
  _id: mongoose.Schema.Types.ObjectId;
  chat_id: number;
  phone: string;
  question: string;
  image: Types.ObjectId;
}

export const QuestionDocument = new Schema<IQuestion>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  chat_id: { type: Number, required: true },
  phone: { type: String, required: true },
  question: { type: String, required: true },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: fileSchema.name,
  },
});

export const questionScheme = model<IQuestion>('questions', QuestionDocument);
