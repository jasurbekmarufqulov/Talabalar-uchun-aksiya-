
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8689394977:AAFo5XmFsNPEQ--8QclWoQlB4ErXhRoFeJ8';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = '2002084215';

// Server holatini tekshirish uchun
http.createServer((req, res) => {
    res.write("Bot backend qismi aktiv!");
    res.end();
}).listen(process.env.PORT || 3000);

console.log("Bot tizimi ishga tushdi...");

// /start buyrug'i kelganda
bot.onText(/\/start/, (msg) => {
    console.log(`Foydalanuvchi start bosdi: ID: ${msg.chat.id}`);
    bot.sendMessage(msg.chat.id, "Salom! 'Omadli Student' aksiyamizga xush kelibsiz! Quyidagi tugmani bosib g'ildirakni aylantiring 👇", {
        reply_markup: {
            inline_keyboard: [[
                { text: "🕹 O'yinni ochish", web_app: { url: "https://jasurbekmarufqulov.github.io/Talabalar-uchun-aksiya-/" } }
            ]]
        }
    });
});

// WebApp dan ma'lumot kelganda (Eng muhim qism)
bot.on('web_app_data', (msg) => {
    console.log("URRA! WebApp dan ma'lumot keldi:", msg.web_app_data.data); // Render konsolida ko'rinadi

    try {
        const data = msg.web_app_data.data; 
        const [prize, type, balance] = data.split('|');
        const userName = msg.from.username ? `@${msg.from.username}` : "Noma'lum";
        const userId = msg.from.id;

        // O'yinchiga xabar
        bot.sendMessage(userId, `🎉 Tabriklaymiz! Siz ${prize} yutib oldingiz!\n💳 Umumiy balansingiz: ${balance} so'm.`);

        // Adminga xabar
        const adminXabar = `🔔 **Yangi Yutuq!**\n\n👤 Talaba: ${userName}\n🆔 ID: ${userId}\n🕹 Urinish turi: ${type}\n💰 Yutgan puli: ${prize}\n💳 Jami balansi: ${balance} so'm`;
        bot.sendMessage(ADMIN_ID, adminXabar, { parse_mode: 'Markdown' });
        
        console.log("Adminga hisobot muvaffaqiyatli yuborildi.");
    } catch (error) {
        console.error("Ma'lumotni qayta ishlashda xato:", error);
    }
});
