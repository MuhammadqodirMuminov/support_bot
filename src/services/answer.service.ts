import { FilterQuery, Model, Types } from 'mongoose';
import { IAnswerData, IResponse } from '../types';
import { answerScheme, IAnswer } from '../models/answer.scheme';

class AnswerService {
  protected answerModal: Model<IAnswer>;

  private _answerSessions: Map<number, IAnswerData> = new Map();
  private _answer: IAnswerData = {};

  constructor(answerModal: Model<IAnswer>) {
    this.answerModal = answerModal;
  }

  get answer(): IAnswerData {
    return this._answer;
  }

  set answer(data: Partial<IAnswerData>) {
    this._answer = { ...this._answer, ...data };
  }

  get answerSession(): Map<number, IAnswerData> {
    return this._answerSessions;
  }

  set answerSession(data: Map<number, IAnswerData>) {
    this._answerSessions = { ...this._answerSessions, ...data };
  }

  async create(answer: Partial<IAnswer>): Promise<IResponse<IAnswer>> {
    try {
      const newAnswer = await this.answerModal.create({
        ...answer,
        _id: new Types.ObjectId(),
      });
      await newAnswer.save();

      return { data: newAnswer };
    } catch (error: any) {
      return { message: 'Error create answer' };
    }
  }

  async getAll(filterQuery: FilterQuery<IAnswer>): Promise<IAnswer[]> {
    const answers = await this.answerModal.find(filterQuery);
    return answers;
  }
}

export default new AnswerService(answerScheme);
