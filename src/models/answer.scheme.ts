import mongoose, { model, Schema, Types } from 'mongoose';
import { fileSchema, IFile } from './file.schema';

export interface IAnswer {
  _id: mongoose.Schema.Types.ObjectId;
  chat_id: number;
  answer: string;
  file?: IFile;
}

export const AnswerDocument = new Schema<IAnswer>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  chat_id: { type: Number, required: true },
  answer: { type: String, required: true },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: fileSchema.name,
  },
});

export const answerScheme = model<IAnswer>('answers', AnswerDocument);
