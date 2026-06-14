function shareReferral() {
    let userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    let botUsername = "SizningBarabanBot"; // Botingiz userneymi
    let text = "Do'stim, mana bu barabanni aylantir va pul yutib ol! 🎁";
    let link = `https://t.me/${botUsername}?start=r_${userId}`;
    
    // Telegramda to'g'ridan-to'g'ri ulashish oynasini ochish
    window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
}
