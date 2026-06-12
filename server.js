const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8689394977:AAFo5XmFsNPEQ--8QclWoQlB4ErXhRoFeJ8';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = '2002084215';

// Render o'chib qolmasligi uchun oddiy mini-server
http.createServer((req, res) => {
    res.write("Bot ishlamoqda...");
    res.end();
}).listen(process.env.PORT || 3000);

// Foydalanuvchi /start bosganda bot javob berishi
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Salom! 'Omadli Student' aksiyamizga xush kelibsiz! Quyidagi tugmani bosib g'ildirakni aylantiring 👇", {
        reply_markup: {
            inline_keyboard: [[
                { text: "🕹 O'yinni ochish", web_app: { url: "https://jasurbekmarufqulov.github.io/Talabalar-uchun-aksiya-/" } }
            ]]
        }
    });
});

// G'ildirak aylangandan keyin keladigan ma'lumotni tutib olish
bot.on('web_app_data', (msg) => {
    const data = msg.web_app_data.data; 
    const [prize, type, balance] = data.split('|');
    const userName = msg.from.username ? `@${msg.from.username}` : "Noma'lum";
    const userId = msg.from.id;

    // Talabaning o'ziga botda javob yuborish
    bot.sendMessage(userId, `🎉 Tabriklaymiz! Siz ${prize} yutib oldingiz!\n💳 Umumiy balansingiz: ${balance} so'm.`);

    // Sizga (Adminga) hisobot yuborish
    const adminXabar = `🔔 **Yangi Yutuq!**\n\n👤 Talaba: ${userName}\n🆔 ID: ${userId}\n🕹 Urinish turi: ${type}\n💰 Yutgan puli: ${prize}\n💳 Jami balansi: ${balance} so'm`;
    bot.sendMessage(ADMIN_ID, adminXabar, { parse_mode: 'Markdown' });
});
