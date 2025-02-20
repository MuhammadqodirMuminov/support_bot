import { SendMessageOptions } from 'node-telegram-bot-api';
import { ms } from '../constants';

export const adminMenu = {
  parse_mode: 'Markdown',
  reply_markup: {
    keyboard: [[{ text: 'Savolar' }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

export const sendQuiz: SendMessageOptions = {
  parse_mode: 'Markdown',
  reply_markup: {
    keyboard: [[{ text: ms.sendQuizBtnText }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

export const next: SendMessageOptions = {
  parse_mode: 'Markdown',
  reply_markup: {
    keyboard: [[{ text: 'Keyingisi' }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

export const sendPhone: SendMessageOptions = {
  parse_mode: 'Markdown',
  reply_markup: {
    keyboard: [[{ text: ms.phoneShare, request_contact: true }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};
