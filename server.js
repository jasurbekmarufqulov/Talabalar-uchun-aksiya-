

const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8689394977:AAFo5XmFsNPEQ--8QclWoQlB4ErXhRoFeJ8';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = '2002084215';

http.createServer((req, res) => {
    res.write("Bot marketing tizimi aktiv!");
    res.end();
}).listen(process.env.PORT || 3000);

console.log("Aksiya bot tizimi ishga tushdi...");

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 Salom! 'Omadli Talaba' rasmiy homiylik aksiyasiga xush kelibsiz!\n\nBu yerda siz har kuni mutlaqo bepul yoki kafolatlangan aksiyalar orqali bonuslar olishingiz mumkin. Boshlash uchun tugmani bosing: 👇", {
        reply_markup: {
            inline_keyboard: [[
                { text: "🎁 Aksiya stendini ochish", web_app: { url: "https://jasurbekmarufqulov.github.io/Talabalar-uchun-aksiya-/" } }
            ]]
        }
    });
});

bot.on('web_app_data', (msg) => {
    try {
        const data = msg.web_app_data.data; 
        const [prize, type, balance] = data.split('|');
        const userName = msg.from.username ? `@${msg.from.username}` : "Noma'lum";
        const userId = msg.from.id;

        // O'yinchiga rag'batlantiruvchi xabar
        bot.sendMessage(userId, `🎉 Muvaffaqiyatli! Homiylarimiz tomonidan sizga ${prize} aksiya bonusi taqdim etildi.\n💳 Sizning umumiy jamg'armangiz: ${balance} so'm.`);

        // Adminga sof marketing hisoboti
        const adminXabar = `📈 **Yangi Aksiya Hisoboti**\n\n👤 Foydalanuvchi: ${userName}\n🆔 ID: ${userId}\n📋 Ishtirok turi: ${type}\n💰 Ajratilgan bonus: ${prize}\n💳 Jami balansi: ${balance} so'm`;
        bot.sendMessage(ADMIN_ID, adminXabar, { parse_mode: 'Markdown' });
        
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
});
