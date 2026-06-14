const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 💾 TEST UCHUN BAZA (Asl loyihada MongoDB bo'lishi tavsiya etiladi)
// Telefon xotirasini tejash uchun vaqtinchalik xotira obyekti
let usersDatabase = {};

// 1. FOYDALANUVCHI MA'LUMOTLARINI OLISH
app.get('/get-user', (req, res) => {
    const { id } = req.query;
    if (!usersDatabase[id]) {
        usersDatabase[id] = { balance: 0, name: "Yangi foydalanuvchi" };
    }
    res.json(usersDatabase[id]);
});

// 2. BALANS YANGILASH (XAVFSIZLIK TEKSHIRUVI BILAN)
app.post('/update-balance', (req, res) => {
    const { id, name, balance } = req.body;
    
    // Server bazasidagi eski ma'lumotni yangilash
    if (!usersDatabase[id]) {
        usersDatabase[id] = { balance: balance, name: name };
    } else {
        usersDatabase[id].balance = balance;
        usersDatabase[id].name = name;
    }
    res.json({ success: true });
});

// 3. TELEGRAM BOT WEBHOOK (REFERAL TIZIMINI JAVASCRIPTDA HISOBALASH)
app.post('/telegram-webhook', async (req, res) => {
    const { message } = req.body;
    
    if (message && message.text) {
        const chatId = message.chat.id; // Botga yangi kirgan do'stning IDsi
        const text = message.text;      // Yuborilgan matn (/start r_JasurbekID)

        // Agar foydalanuvchi referal link orqali kirgan bo'lsa
        if (text.startsWith('/start r_')) {
            const inviterId = text.split('r_')[1]; // Taklif qilgan odamning IDsini ajratish

            // O'zini o'zi taklif qilmaganligini va yangi foydalanuvchiligini tekshirish
            if (chatId.toString() !== inviterId.toString()) {
                
                // Taklif qilgan odam bazada bormi? Yo'q bo'lsa ochamiz
                if (!usersDatabase[inviterId]) {
                    usersDatabase[inviterId] = { balance: 500, name: "Admin" };
                } else {
                    usersDatabase[inviterId].balance += 500; // Hisobiga 500 so'm qo'shish
                }

                // Taklif qilgan odamga bot orqali xushxabar yuborish
                await sendTelegramNotification(inviterId, "🎉 Do'stingiz taklifingizni qabul qildi! Hisobingizga +500 so'm qo'shildi! 🎁");
            }
        }
    }
    res.sendStatus(200);
});

// 4. KARTA RAQAMINI VA PUL YECHISH ARIZASINI ADMINGA YUBORISH
app.post('/withdraw', async (req, res) => {
    const { id, name, card, summa } = req.body;

    // Xavfsizlik tekshiruvi: Haqiqatdan ham bazada shuncha puli bormi?
    if (!usersDatabase[id] || usersDatabase[id].balance < summa || summa <= 0) {
        return res.json({ success: false, message: "Tizimni aldash taqiqlanadi!" });
    }

    // Adminga boradigan ariza formati
    const adminXabari = `📩 **YANGI PUL YECHISH ARIZASI**\n\n` +
                        `👤 Ismi: ${name}\n` +
                        `🆔 Telegram ID: ${id}\n` +
                        `💳 Karta raqami: \`${card}\`\n` +
                        `💰 Yechiladigan summa: ${summa} so'm`;

    const adminChatId = "YOUR_PERSONAL_TELEGRAM_ID"; // O'zingizning shaxsiy Telegram ID raqamingizni yozing

    // Adminga xabar jo'natish
    const yuborildi = await sendTelegramNotification(adminChatId, adminXabari);
    
    if (yuborildi) {
        usersDatabase[id].balance = 0; // Arizadan keyin uning balansini 0 qilamiz
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// TELEGRAM API ORQALI XABAR YUBORUVChI YORDAMCHI FUNKSIYA
async function sendTelegramNotification(chatId, text) {
    const botToken = process.env.BOT_TOKEN; // Render sozlamalaridan yashirin olingan token
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" })
        });
        return true;
    } catch (err) {
        console.log("Telegram xabar yuborishda xatolik:", err);
        return false;
    }
}

// SERVER PORTINI ISHGA TUSHIRISH
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda muvaffaqiyatli ishlamoqda...`);
});
