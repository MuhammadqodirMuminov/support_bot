import { FilterQuery, Model, Types } from 'mongoose';
import { IPagination, IQuestionData, IResponse } from '../types';
import { IQuestion, questionScheme } from '../models/question.schema';

class QuestionService {
  protected questionModel: Model<IQuestion>;

  private _question: IQuestionData = {};
  private _pagination: Map<number, IPagination> = new Map([
    [1, { page: 1, limit: 5, totalDocs: 5 }],
  ]);

  constructor(questionModel: Model<IQuestion>) {
    this.questionModel = questionModel;
  }

  get question(): IQuestionData {
    return this._question;
  }

  set question(data: Partial<IQuestionData>) {
    this._question = { ...this._question, ...data };
  }

  get pagination(): Map<number, IPagination> {
    return this._pagination;
  }

  set pagination(data: Partial<IPagination>) {
    this._pagination = { ...this._pagination, ...data };
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

  async countQuestions(filterQuery: FilterQuery<IQuestion>): Promise<number> {
    return this.questionModel.countDocuments(filterQuery).exec();
  }

  async getAllQuestions(
    filterQuery: FilterQuery<IQuestion>,
    chatId?: number,
  ): Promise<IQuestion[]> {
    const pagination = this._pagination.get(chatId || 1);
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const questions = await this.questionModel
      .find(filterQuery)
      .skip(skip)
      .limit(limit)
      .populate('file')
      .exec();
    return questions;
  }
}

export default new QuestionService(questionScheme);
