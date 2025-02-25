import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../config/bot.config';
import { ms } from '../constants';
import { mp } from '../utils';
import { isAdmin } from '../utils/check-admin';
import questionService from '../services/question.service';
import { FileTypes } from '../types';
import answerService from '../services/answer.service';
import fileService from '../services/file.service';
import { IFile } from '../models/file.schema';
import { quizCaption } from '../constants/messages';

class AdminModule {
  private bot: TelegramBot;
  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  admin() {
    this.bot.onText(/\/(admin|admin_menu)/, async (msg) => {
      const chatId = msg.chat.id;

      try {
        const success = isAdmin(chatId);

        if (success) {
          await this.admin_options(chatId);
        } else {
          await this.bot.sendMessage(chatId, ms.notAdmin, {
            parse_mode: 'Markdown',
          });
        }
      } catch (error: any) {
        console.log(error);

        this.bot.sendMessage(chatId, `Error: ${error?.message}`, {
          parse_mode: 'Markdown',
        });
      }
    });
  }

  questions() {
    this.bot.onText(new RegExp('Savolar'), async (msg) => {
      const chatId = msg.chat.id;
      try {
        const success = isAdmin(chatId);

        if (success) {
          const questions = await questionService.getAllQuestions({
            answer: null,
          });

          if (questions.length) {
            for (const question of questions) {
              if (
                question?.file?.fileType === FileTypes.IMAGE &&
                question?.file?.fileId
              ) {
                await this.bot.sendPhoto(chatId, question?.file?.fileId, {
                  caption: ms.quizCaption(question.question, question.phone),
                  reply_markup: mp.listQuestion(question._id.toString()),
                  parse_mode: 'Markdown',
                });
              } else if (
                question?.file?.fileType === FileTypes.DOCUMENT &&
                question?.file?.fileId
              ) {
                await this.bot.sendDocument(chatId, question?.file?.fileId, {
                  caption: ms.quizCaption(question.question, question.phone),
                  reply_markup: mp.listQuestion(question._id.toString()),
                  parse_mode: 'Markdown',
                });
              } else if (
                question?.file?.fileType === FileTypes.VIDEO &&
                question?.file?.fileId
              ) {
                await this.bot.sendVideo(chatId, question?.file?.fileId, {
                  caption: ms.quizCaption(question.question, question.phone),
                  reply_markup: mp.listQuestion(question._id.toString()),
                  parse_mode: 'Markdown',
                });
              } else {
                await this.bot.sendMessage(
                  chatId,
                  ms.quizCaption(question.question, question.phone),
                  {
                    reply_markup: mp.listQuestion(question._id.toString()),
                    parse_mode: 'Markdown',
                  },
                );
              }
            }
          } else {
            await this.bot.sendMessage(chatId, ms.noQuestions, {
              parse_mode: 'Markdown',
            });
          }
        }
      } catch (error: any) {
        console.log(error);

        this.bot.sendMessage(chatId, `Error: ${error?.message}`, {
          parse_mode: 'Markdown',
        });
      }
    });
  }

  answer() {
    this.bot.on('callback_query', async (msg) => {
      const chatId = msg.message?.chat.id;
      const messageId = msg.message?.message_id;
      const data = msg.data?.split('-');

      if (data?.[0] === 'answer') {
        const questionId = data?.[1];

        await this.bot.sendMessage(chatId!, ms.answer);

        this.bot.once('message', async (msg) => {
          const text = msg.text;
          // answerService.answer = { text, questionId };

          answerService.answerSession.set(chatId!, { text, questionId });

          await this.bot
            .sendMessage(chatId!, ms.answerFile, {
              reply_to_message_id: messageId,
              reply_markup: mp.next.reply_markup,
              parse_mode: 'Markdown',
            })
            .then(() => this.sendFile());
        });
      }
    });
  }

  sendFile() {
    this.bot.once('message', async (msg) => {
      const chatId = msg.chat.id;

      const session = answerService.answerSession.get(chatId!);
      if (!session) return;

      const photo = msg.photo?.[0].file_id;
      const file = msg.document?.file_id;
      const video = msg.video?.file_id;

      let fileData;

      if (file) {
        fileData = { file, fileType: FileTypes.DOCUMENT };
      } else if (photo) {
        fileData = { file: photo, fileType: FileTypes.IMAGE };
      } else if (video) {
        fileData = { file: video, fileType: FileTypes.VIDEO };
      }

      let newFile: IFile | undefined;

      if (fileData) {
        newFile = await fileService.createFile({
          fileId: fileData.file!,
          fileType: fileData.fileType,
        });
      }

      const newAnswer = await answerService.create({
        chat_id: chatId,
        answer: session.text,
        file: newFile,
      });

      const { data } = await questionService.update(
        answerService.answer.questionId!,
        {
          answer: newAnswer.data,
        },
      );

      if (data?.file?.fileType === FileTypes.VIDEO && data?.file?.fileId) {
        await this.bot.sendVideo(data?.chat_id!, data?.file?.fileId, {
          caption: quizCaption(data?.question, data?.phone),
          parse_mode: 'Markdown',
        });
      } else if (
        data?.file?.fileType === FileTypes.DOCUMENT &&
        data?.file?.fileId
      ) {
        await this.bot.sendDocument(data?.chat_id!, data?.file?.fileId, {
          caption: quizCaption(data?.question, data?.phone),
          parse_mode: 'Markdown',
        });
      } else if (
        data?.file?.fileType === FileTypes.IMAGE &&
        data?.file?.fileId
      ) {
        await this.bot.sendPhoto(data?.chat_id!, data?.file?.fileId, {
          caption: quizCaption(data?.question, data?.phone),
          parse_mode: 'Markdown',
        });
      } else {
        await this.bot.sendMessage(
          data?.chat_id!,
          quizCaption(data?.question || '', data?.phone || ''),
          {
            parse_mode: 'Markdown',
          },
        );
      }

      if (newFile?.fileType === FileTypes.VIDEO && newFile?.fileId) {
        await this.bot.sendVideo(chatId, newFile?.fileId, {
          caption: ms.answerCaption(answerService.answer.text),
          parse_mode: 'Markdown',
        });
      } else if (newFile?.fileType === FileTypes.DOCUMENT && newFile?.fileId) {
        await this.bot.sendDocument(chatId, newFile?.fileId, {
          caption: ms.answerCaption(answerService.answer.text),
          parse_mode: 'Markdown',
        });
      } else if (newFile?.fileType === FileTypes.IMAGE && newFile?.fileId) {
        await this.bot.sendPhoto(chatId, newFile?.fileId, {
          caption: ms.answerCaption(answerService.answer.text),
          parse_mode: 'Markdown',
        });
      } else {
        await this.bot.sendMessage(
          data?.chat_id!,
          ms.answerCaption(answerService.answer.text),
        );
      }

      await this.bot.sendMessage(chatId, ms.sentAnswer, mp.adminMenu);
      // answerService.answer = {};
      answerService.answerSession.delete(chatId);
    });
  }

  async admin_options(chatId: number) {
    return await this.bot.sendMessage(chatId, 'Admin', mp.adminMenu);
  }

  init() {
    this.admin();
    this.questions();
    this.answer();
  }
}

export default new AdminModule(bot);
