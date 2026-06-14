// server.js (Node.js backend skripti)
const express = require('express');
const app = express();
app.use(express.json());

// Telegram Botdan keladigan xabarlarni tutish (Webhook)
app.post('/telegram-webhook', async (req, res) => {
    const { message } = req.body;
    
    if (!message || !message.text) {
        return res.sendStatus(200);
    }

    const chatId = message.chat.id; // Yangi kirgan odamning IDsi
    const text = message.text;      // Botga yozilgan matn (masalan: "/start r_12345678")

    // Agar odam referal link orqali kirgan bo'lsa
    if (text.startsWith('/start r_')) {
        // Taklif qilgan odamning Telegram IDsini ajratib olamiz
        const inviterId = text.split('r_')[1]; 

        // O'z-o'zini taklif qilmaganini tekshiramiz
        if (chatId.toString() !== inviterId.toString()) {
            
            // 📝 BU YERDA JAVASCRIPT MANTIQI (Bazaga yozish):
            // 1. Ma'lumotlar bazasidan (MongoDB) inviterId egasini topamiz
            // 2. Uning balansiga bonus ball yoki +1 ta aylantirish imkoniyatini qo'shamiz
            
            console.log(`🎉 Omadli taklif! ${inviterId} egasiga referal bonus qo'shildi.`);
            
            // Taklif qilgan odamga Telegram bot orqali xabar yuborish
            await sendTelegramMessage(inviterId, "Siz taklif qilgan do'stingiz botga kirdi! Sizga +5000 so'm bonus berildi! 🎁");
        }
    }

    res.sendStatus(200);
});

// Telegramga xabar yuboruvchi yordamchi funksiya
async function sendTelegramMessage(chatId, text) {
    const botToken = process.env.BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text })
    });
        }
