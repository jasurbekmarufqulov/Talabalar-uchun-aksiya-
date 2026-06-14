// Barabanning aylanish vizual effekti va yangi yutuqlar algoritmi
function omadniSinash(rejim) {
    let gildirak = document.getElementById("baraban_gildiragi");
    let randomDeg = Math.floor(Math.random() * 360) + 1800; // 5 marta to'liq aylanish effekti
    gildirak.style.transform = `rotate(${randomDeg}deg)`;

    // Baraban 3 soniya aylanadi, keyin yutuq hisoblanadi
    setTimeout(() => {
        let yutuq = 0;

        if (rejim === 'regular') {
            // 🎰 500 so'mlik rejim: 500 so'mdan 10 000 so'mgacha tasodifiy yutuqlar
            // O'yin qiziq bo'lishi uchun 0 (yutqaziq) ham qo'shilgan
            let yutuqlarXonasi = [0, 500, 1000, 2000, 3000, 5000, 10000];
            yutuq = yutuqlarXonasi[Math.floor(Math.random() * yutuqlarXonasi.length)];
            
            if (yutuq > 0) {
                alert(`🎰 Oddiy baraban! Omadingiz keldi, sizga ${yutuq} so'm yutuq chiqdi!`);
            } else {
                alert(`😢 Bu safar omadingiz kelmadi! Keyingi aylantirishda albatta omad kulib boqadi.`);
            }
        } 
        else if (rejim === 'premium') {
            // 👑 5000 so'mlik rejim: Bunda 500 so'm chiqish ehtimoli juda kam, 
            // asosan eng yuqori yutuqlar (5000 va 10000) chiqish imkoniyati yuqori bo'ladi
            let premiumYutuqlar = [500, 2000, 5000, 5000, 10000, 10000, 10000];
            yutuq = premiumYutuqlar[Math.floor(Math.random() * premiumYutuqlar.length)];
            alert(`👑 Premium baraban! Katta yutuqlar zonasi: sizga ${yutuq} so'm chiqdi!`);
        }

        // Yangi yutuqni joriy balansga qo'shish
        joriyBalans += yutuq; 
        document.getElementById("balans_matni").innerText = joriyBalans + " so'm";
        
        // Serverdagi bazaga yangi balansni xavfsiz yuborish
        balansniServerdaYangila(joriyBalans);
    }, 3000); // 3 soniyadan keyin baraban to'xtaydi
}
