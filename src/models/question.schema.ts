import mongoose, { model, Schema, Types } from 'mongoose';
import { fileSchema, IFile } from './file.schema';
import { answerScheme, IAnswer } from './answer.scheme';

export interface IQuestion {
  _id: mongoose.Schema.Types.ObjectId;
  chat_id: number;
  phone: string;
  question: string;
  file?: IFile;
  answer?: IAnswer;
}

export const QuestionDocument = new Schema<IQuestion>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  chat_id: { type: Number, required: true },
  phone: { type: String, required: true },
  question: { type: String, required: true },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'files',
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'answers',
  },
});

export const questionScheme = model<IQuestion>('questions', QuestionDocument);
