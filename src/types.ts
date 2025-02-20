export interface IResponse<T = null> {
  message?: string;
  data?: T;
  success?: boolean;
}

export enum FileTypes {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export interface IQuestionData {
  text?: string;
  phone?: string;
  file?: string;
  fileType?: FileTypes;
  answer?: string;
}

export interface IAnswerData {
  text?: string;
  file?: string;
  fileType?: FileTypes;
  questionId?: string;
}
