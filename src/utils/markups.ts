import { SendMessageOptions } from 'node-telegram-bot-api';

export const adminMenu = {
	keyboard: [
		[{ text: '/stat' }],
		[{ text: '/test' }, { text: '/mail_users' }],
		[{ text: '/subscription' }, { text: '/ads' }],
	],
	resize_keyboard: true,
	one_time_keyboard: false,
};

export const testInlineButton = (code: number): SendMessageOptions['reply_markup'] => ({
	remove_keyboard: true,
	selective: true,
	inline_keyboard: [
		[{ text: 'send', callback_data: `send_test_${code}` }],
		[
			{
				text: '❌ delete test',
				callback_data: `edit_test_${code}`,
			},
		],
		[
			{
				text: 'Results ✅',
				callback_data: `results_test_${code}`,
			},
		],
	],
	resize_keyboard: true,
	one_time_keyboard: false,
});

export const userMenu: SendMessageOptions['reply_markup'] = {
	keyboard: [[{ text: '📝 Tekshirish' }, { text: '📊 Statistikam' }]],
	resize_keyboard: true,
	one_time_keyboard: false,
};

export const offMarkup: SendMessageOptions['reply_markup'] = {
	remove_keyboard: true,
	selective: true,
};

export const subscribeMenu: SendMessageOptions['reply_markup'] = {
	keyboard: [
		[{ text: '/create' }, { text: '/getAll' }],
		[{ text: '/turnOff' }, { text: '/turnOn' }],
		[{ text: '/admin' }],
	],
	resize_keyboard: true,
	one_time_keyboard: false,
};

export const subscribeInlineButton = (username: string): SendMessageOptions['reply_markup'] => ({
	inline_keyboard: [
		[
			{
				text: '❌ delete',
				callback_data: `delete_ads_${username}`,
			},
		],
	],
});

export const adsMenu: SendMessageOptions['reply_markup'] = {
	keyboard: [
		[{ text: '/turn_on_ads' }, { text: '/turn_off_ads' }],
		[{ text: '/new_ad' }, { text: '/delete_ad' }],
		[{ text: '/list_ad' }, { text: '/get_ad' }],
		[{ text: '/admin' }],
	],
	remove_keyboard: true,
	one_time_keyboard: false,
};

export const adsMedia = (text: string, url: string): SendMessageOptions['reply_markup'] => ({
	inline_keyboard: [[{ text, url }]],
});

export const confirmAd: SendMessageOptions['reply_markup'] = {
	keyboard: [[{ text: '/confirmAd' }, { text: '/declineAd' }]],
};

export const channelBtns = (cannels: string[]): SendMessageOptions['reply_markup'] => {
	return {
		inline_keyboard: [
			cannels.map((c, i) => {
				return { text: `${i + 1}-kanalga o'tish 👉`, url: `https://t.me/${c}` };
			}),
			[{ text: "✅Azo bo'ldim", callback_data: 'user_joined' }],
		],
		resize_keyboard: true,
	};
};
