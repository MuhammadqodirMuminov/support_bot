import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../config/bot.config';
import { ms } from '../constants';
import { mp } from '../utils';
import questionService from '../services/question.service';
import fileService from '../services/file.service';
import { FileTypes } from '../types';
import { IFile } from '../models/file.schema';

class StartModule {
  private bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  private start() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId, ms.startMessage, mp.sendQuiz);
    });
  }

  sendQuestion() {
    this.bot.onText(new RegExp(ms.sendQuizBtnText), async (msg) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId, ms.questionText);

      this.bot.once('message', async (response) => {
        if (response.chat.id !== chatId) return;

        const text = response.text?.trim();
        if (text?.length) {
          questionService.question = { text };
          await this.bot
            .sendMessage(chatId, ms.questionFile, mp.next)
            .then(() => this.sendFile());
        }
      });
    });
  }

  sendFile() {
    this.bot.once('message', async (msg) => {
      const chatId = msg.chat.id;
      const photo = msg.photo?.[0].file_id;
      const file = msg.document?.file_id;
      const video = msg.video?.file_id;

      if (file || photo || video) {
        if (file) {
          // await this.bot.sendDocument(chatId, file);
          questionService.question = { file, fileType: FileTypes.DOCUMENT };
        } else if (photo) {
          // await this.bot.sendPhoto(chatId, photo);
          questionService.question = { file: photo, fileType: FileTypes.IMAGE };
        } else if (video) {
          // await this.bot.sendVideo(chatId, video);
          questionService.question = { file: video, fileType: FileTypes.VIDEO };
        }
      }

      await this.bot.sendMessage(chatId, ms.questionPhone, mp.sendPhone);
    });
  }

  callback() {
    this.bot.on('contact', async (msg) => {
      const chatId = msg.chat.id;
      const phone = msg.contact?.phone_number;
      let file;

      questionService.question = { phone };

      if (questionService.question.file) {
        file = await fileService.createFile({
          fileId: questionService.question.file,
          fileType: questionService.question.fileType,
        });
      }

      await questionService.create({
        chat_id: chatId,
        question: questionService.question.text,
        phone: questionService.question.phone,
        file,
      });

      await this.bot.sendMessage(
        chatId,
        'Savolingiz qabul qilindi!',
        mp.sendQuiz,
      );
      questionService.question = {};
    });
  }

  setCommands() {
    this.bot.setMyCommands([
      { command: '/start', description: 'Start the bot' },
      { command: '/help', description: 'Bot helps and sitemaps' },
    ]);
  }

  init() {
    this.start();
    this.setCommands();
    this.sendQuestion();
    this.callback();
  }
}

export default new StartModule(bot);
