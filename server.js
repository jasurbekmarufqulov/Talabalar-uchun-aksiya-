const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// Yangi taqdim etilgan xavfsiz token va sizning Admin ID raqamingiz
const token = '8947184537:AAHJr2rVEQ_lfvSY8Ixh5dzUNkOTvRvaO5E';
const ADMIN_ID = '2002084215';

const bot = new TelegramBot(token, { polling: true });

// Render o'chib qolmasligi uchun veb-server porti
http.createServer((req, res) => {
    res.write("Aksiya marketing platformasi faol holatda!");
    res.end();
}).listen(process.env.PORT || 3000);

console.log("Bot tizimi muvaffaqiyatli ishga tushdi...");

// /start buyrug'i kelganda aksiya tugmasini chiqarish
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 Salom! 'Omadli Talaba' rasmiy aksiyasiga xush kelibsiz!\n\nAksiyamizda ishtirok etish va kafolatlangan bonuslarga ega bo'lish uchun quyidagi tugmani bosing: 👇", {
        reply_markup: {
            inline_keyboard: [[
                { text: "🎁 Aksiya stendini ochish", web_app: { url: "https://jasurbekmarufqulov.github.io/Talabalar-uchun-aksiya-/" } }
            ]]
        }
    });
});

// O'yin tugab, Telegram WebApp ma'lumot yuborganida
bot.on('web_app_data', (msg) => {
    try {
        const data = msg.web_app_data.data; 
        const [prize, type, balance] = data.split('|');
        const userName = msg.from.username ? `@${msg.from.username}` : "Noma'lum";
        const userId = msg.from.id;
        const fullName = `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim() || "Ism kiritilmagan";

        // Ishtirokchining o'ziga yutuq xabari
        bot.sendMessage(userId, `🎉 Tabriklaymiz!\nAksiya doirasida sizga ${prize} bonus taqdim etildi.\n\n💳 Sizning joriy balansingiz: ${balance} so'm.`);

        // Adminga (Sizga) toliq marketing hisoboti
        const adminXabar = `📈 **YANGI AKSIYA ISHTIROKCHISI**\n\n` +
                           `👤 Foydalanuvchi: ${fullName} (${userName})\n` +
                           `🆔 Telegram ID: \`${userId}\`\n` +
                           `📋 Ishtirok turi: ${type}\n` +
                           `💰 Berilgan bonus: ${prize}\n` +
                           `💳 Umumiy balansi: ${balance} so'm\n` +
                           `📅 Vaqti: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;
                           
        bot.sendMessage(ADMIN_ID, adminXabar, { parse_mode: 'Markdown' });
        
    } catch (error) {
        console.error("Ma'lumotni qayta ishlashda xatolik:", error);
    }
});
