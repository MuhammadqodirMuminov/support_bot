import dotenv from 'dotenv';

dotenv.config();

export const isAdmin = (chatId: number) => {
  const admins: string = process.env.ADMINS!;

  return admins.split(',').includes(chatId.toString());
};
