import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../config/bot.config';
import { ADMIN_PASS } from '../config/environment.config';
import { ms } from '../constants';
import { extractUniqueCode, mp } from '../utils';

class AdminModule {
  private bot: TelegramBot;
  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  admin() {
    this.bot.onText(/\/(admin|admin_menu)/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username || 'User';
      try {
        const code = extractUniqueCode(msg.text!);
        const { success } = await adminService.isAdmin(chatId);

        if (success) {
          await this.admin_options(chatId, username);
        } else if (!success && code == ADMIN_PASS) {
          await adminService.create({ chat_id: chatId, username });
          await this.admin_options(chatId, username);
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

  async admin_options(chatId: number, username: string) {
    return await this.bot.sendMessage(chatId, 'Admin', mp.adminMenu);
  }

  init() {
    this.admin();
  }
}

export default new AdminModule(bot);
