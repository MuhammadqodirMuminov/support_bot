import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../config/bot.config';

class StartModule {
  private bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  private start() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId, 'Hi');
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
  }
}

export default new StartModule(bot);
