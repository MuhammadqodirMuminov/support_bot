import { FilterQuery, Model, Types } from 'mongoose';
import { IQuestionData, IResponse } from '../types';
import { IQuestion, questionScheme } from '../models/question.schema';

class QuestionService {
  protected questionModel: Model<IQuestion>;

  private _question: IQuestionData = {};

  constructor(questionModel: Model<IQuestion>) {
    this.questionModel = questionModel;
  }

  get question(): IQuestionData {
    return this._question;
  }

  set question(data: Partial<IQuestionData>) {
    this._question = { ...this._question, ...data };
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

  async update(
    id: string,
    question: Partial<IQuestion>,
  ): Promise<IResponse<IQuestion>> {
    try {
      const updateQuestion = await this.questionModel
        .findByIdAndUpdate(id, question, { new: true })
        .populate('file');

      if (!updateQuestion) {
        return { message: 'Question not found' };
      }

      return { data: updateQuestion };
    } catch (error) {
      return { message: 'Error update question' };
    }
  }

  async getAllQuestions(
    filterQuery: FilterQuery<IQuestion>,
  ): Promise<IQuestion[]> {
    const questions = await this.questionModel
      .find(filterQuery)
      .populate('file');
    return questions;
  }
}

export default new QuestionService(questionScheme);
