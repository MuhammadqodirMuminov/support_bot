import dotenv from 'dotenv';

dotenv.config();

export const isAdmin = () => {
  const admins: string = process.env.ADMINS!;

  return admins.split(',').includes(process.env.BOT_ID!);
};
