const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// Bot tokeni va Admin ID
const token = '8689394977:AAHVMFiY4yJl6d8EGB0wJpU6rBgB_Fxwenc';
const ADMIN_ID = '2002084215';

// MASALAN SHU YERDA BOTNI YARATISH QATORI ETISHMAYOTGAN EDI (TUZATILDI):
const bot = new TelegramBot(token, { polling: true });

// Render o'chib qolmasligi uchun kichik veb-server
http.createServer((req, res) => {
    res.write("Bot marketing tizimi aktiv!");
    res.end();
}).listen(process.env.PORT || 3000);

console.log("Aksiya bot tizimi yangi token bilan muvaffaqiyatli ishga tushdi...");

// /start buyrug'i kelganda
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 Salom! 'Omadli Talaba' rasmiy homiylik aksiyasiga xush kelibsiz!\n\nBu yerda siz har kuni mutlaqo bepul yoki kafolatlangan aksiyalar orqali bonuslar olishingiz mumkin. Boshlash uchun tugmani bosing: 👇", {
        reply_markup: {
            inline_keyboard: [[
                { text: "🎁 Aksiya stendini ochish", web_app: { url: "https://jasurbekmarufqulov.github.io/Talabalar-uchun-aksiya-/" } }
            ]]
        }
    });
});

// WebApp'dan ma'lumot kelganda
bot.on('web_app_data', (msg) => {
    try {
        const data = msg.web_app_data.data; 
        const [prize, type, balance] = data.split('|');
        const userName = msg.from.username ? `@${msg.from.username}` : "Noma'lum";
        const userId = msg.from.id;

        // O'yinchiga xabar
        bot.sendMessage(userId, `🎉 Muvaffaqiyatli! Homiylarimiz tomonidan sizga ${prize} aksiya bonusi taqdim etildi.\n💳 Sizning umumiy jamg'armangiz: ${balance} so'm.`);

        // Adminga aksiya hisoboti
        const adminXabar = `📈 **Yangi Aksiya Hisoboti**\n\n👤 Foydalanuvchi: ${userName}\n🆔 ID: ${userId}\n📋 Ishtirok turi: ${type}\n💰 Ajratilgan bonus: ${prize}\n💳 Jami balansi: ${balance} so'm`;
        bot.sendMessage(ADMIN_ID, adminXabar, { parse_mode: 'Markdown' });
        
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
});
