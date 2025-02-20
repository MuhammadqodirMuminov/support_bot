import { FilterQuery, Model, Types } from 'mongoose';
import { IResponse } from '../types';
import { IQuestion, questionScheme } from '../models/question.schema';

class QuestionService {
  protected questionModel: Model<IQuestion>;

  constructor(questionModel: Model<IQuestion>) {
    this.questionModel = questionModel;
  }

  async create(question: Partial<IQuestion>): Promise<IResponse<IQuestion>> {
    try {
      const newQuestion = await this.questionModel.create({
        ...question,
        _id: new Types.ObjectId(),
      });
      await newQuestion.save();

      return { data: newQuestion };
    } catch (error: any) {
      return { message: 'Error create question' };
    }
  }

  async getAllQuestions(
    filterQuery: FilterQuery<IQuestion>,
  ): Promise<IQuestion[]> {
    const questions = await this.questionModel.find(filterQuery);
    return questions;
  }
}

export default new QuestionService(questionScheme);
