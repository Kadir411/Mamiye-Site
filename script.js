document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const heartsContainer = document.getElementById('hearts-container');
    const mcqueenImg = document.getElementById('mcqueen-img');
    const questionBox = document.querySelector('.question');
    const buttonsContainer = document.querySelector('.buttons-container');
    
    // Mobil cihaz kontrolü
    const isMobile = window.innerWidth <= 768;
    
    // Ekran yönü değişikliğini dinle
    window.addEventListener('resize', () => {
        // Ekran boyutuna göre hareket ayarlama
        adjustButtonMovement();
    });
    
    // Ekran boyutuna göre hareket ayarlama fonksiyonu
    function adjustButtonMovement() {
        if (window.innerWidth <= 480 || (window.innerHeight <= 480 && window.innerWidth > window.innerHeight)) {
            // Küçük ekranlarda veya yatay modda daha az hareket mesafesi
            padding = 8;
        } else {
            padding = 15;
        }
    }
    
    // İlk yüklenmede ayarla
    let padding = 15;
    adjustButtonMovement();
    
    // Resmin yüklenip yüklenmediğini kontrol et
    mcqueenImg.onerror = function() {
        this.src = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="red" width="200" height="150"/><text fill="white" font-family="Arial" font-size="14" x="50" y="75">Şimşek McQueen</text><text fill="white" font-family="Arial" font-size="14" x="55" y="95">Resmi Eksik</text></svg>';
        console.log('Şimşek McQueen resmi yüklenemedi!');
    };
    
    // Hayır butonunu başlangıç konumu
    noBtn.style.position = 'static';  // Normal akışta
    noBtn.style.zIndex = '1000';      // Her zaman en üstte
    
    // Hayır butonunun orjinal pozisyonunu sakla
    const noBtnOriginal = {
        parent: noBtn.parentNode,
        nextSibling: noBtn.nextSibling
    };
    
    // Hayır butonunu kaçırma fonksiyonu
    noBtn.addEventListener('mouseover', function(e) {
        // Dokunmatik ekranlarda hover event'i tetiklenebilir, bu durumu önle
        if (isTouchDevice() && e.pointerType === 'touch') {
            return;
        }
        
        // Buton şu anda statik pozisyondaysa, kaç
        if (this.style.position === 'static') {
            // Butonu question kutusuna taşı
            questionBox.appendChild(this);
            
            // Butonun pozisyonunu absolute yap
            this.style.position = 'absolute';
            
            // Beyaz kutu içinde rastgele bir pozisyona yerleştir
            moveButtonRandomly(this);
        } else {
            // Zaten absolute pozisyondaysa sadece yerini değiştir
            moveButtonRandomly(this);
        }
    });
    
    // Dokunmatik ekran için özel kaçma fonksiyonu
    noBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        
        // Butonu question kutusuna taşı (eğer zaten taşınmadıysa)
        if (this.style.position === 'static') {
            questionBox.appendChild(this);
            this.style.position = 'absolute';
        }
        
        // Butonu kaçır
        moveButtonRandomly(this);
    });
    
    // Dokunmatik cihaz kontrolü
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
    }
    
    // Hayır butonunu rastgele bir pozisyona taşıma fonksiyonu
    function moveButtonRandomly(button) {
        // Beyaz kutu sınırları
        const boxBounds = questionBox.getBoundingClientRect();
        
        // Butonun boyutları
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;
        
        // Beyaz kutunun göreceli sınırları
        const maxX = boxBounds.width - buttonWidth - padding;
        const maxY = boxBounds.height - buttonHeight - padding;
        const minX = padding;
        const minY = padding;
        
        // Rastgele pozisyon
        const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
        const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
        
        // Butonun pozisyonunu ayarla (beyaz kutuya göre göreceli)
        button.style.left = randomX + 'px';
        button.style.top = randomY + 'px';
        
        // Butonun hep önde olmasını sağla
        button.style.zIndex = '1000';
        
        // Animasyon efekti
        button.style.transition = 'none';
        button.style.transform = 'scale(0.9)';
        
        // Animasyonu sıfırla
        setTimeout(() => {
            button.style.transition = 'transform 0.2s ease';
            button.style.transform = 'scale(1)';
        }, 50);
    }
    
    // Evet butonuna tıklandığında
    yesBtn.addEventListener('click', () => {
        // Kutlama modunu aktifleştir
        questionBox.classList.add('celebration-active');
        
        // Kalpleri yağdırma
        createHearts();
        
        // Şimşek McQueen'in resmini büyüt
        mcqueenImg.style.transform = 'scale(1.2)';
        mcqueenImg.style.transition = 'transform 0.8s ease';
        mcqueenImg.style.boxShadow = '0 15px 35px rgba(255, 71, 87, 0.5)';
        
        // 'Thank you!' mesajı
        const question = document.querySelector('h1');
        question.textContent = 'Kachow! Harikasın!';
        
        // Hayır butonunu gizle
        noBtn.style.display = 'none';
        
        // Evet butonunu güncelle
        yesBtn.textContent = '❤️';
        yesBtn.style.transform = 'scale(1.2)';
        yesBtn.style.backgroundColor = '#ff2e43';
        yesBtn.style.boxShadow = '0 8px 25px rgba(255, 71, 87, 0.7)';
        
        // Ekstra konfeti efekti
        setTimeout(() => {
            createConfetti();
        }, 300);
    });
    
    // Kalplerin sayısını ekran boyutuna göre ayarla
    function getHeartCount() {
        if (window.innerWidth <= 480) {
            return 40; // Mobil için daha az kalp
        } else if (window.innerWidth <= 768) {
            return 50; // Tablet için orta sayıda kalp
        }
        return 70; // Masaüstü için çok kalp
    }
    
    // Kalp oluşturma fonksiyonu
    function createHearts() {
        // Ekran boyutuna göre kalp sayısını ayarla
        const heartCount = getHeartCount();
        
        // Çoklu kalp oluştur
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                createHeart();
            }, i * 80); // Her kalp arasında 80ms gecikme
        }
    }
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Ekran boyutuna göre kalp boyutunu ayarla
        const sizeFactor = window.innerWidth <= 480 ? 0.7 : 1;
        
        // Rastgele boyut
        const size = (Math.random() * 40 + 20) * sizeFactor;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        
        // Rastgele renk
        const colors = ['#ff5252', '#ff4757', '#ff6b81', '#ff7675', '#ff9ff3', '#ff0844', '#ffb199'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Kalp şekli oluştur
        heart.innerHTML = '❤️';
        heart.style.fontSize = size + 'px';
        heart.style.color = randomColor;
        
        // Rastgele başlangıç pozisyonu (ekranın altından)
        const startX = Math.random() * window.innerWidth;
        heart.style.position = 'fixed';
        heart.style.left = startX + 'px';
        heart.style.bottom = '-50px';
        
        // Ekran boyutuna göre animasyon süresini ayarla
        const durationFactor = window.innerWidth <= 480 ? 0.8 : 1;
        
        // Animasyon hızı ve gecikme
        const duration = (Math.random() * 4 + 3) * durationFactor; // 3-7 saniye
        const delay = Math.random() * 0.5; // 0-0.5 saniye gecikme
        
        heart.style.animation = `floatHeart ${duration}s ease-in-out ${delay}s forwards`;
        
        // Belgeye ekle
        heartsContainer.appendChild(heart);
        
        // Animasyon bitince kaldır
        setTimeout(() => {
            heart.remove();
        }, (duration + delay) * 1000);
    }
    
    // Konfeti sayısını ekran boyutuna göre ayarla
    function getConfettiCount() {
        if (window.innerWidth <= 480) {
            return 50; // Mobil için daha az konfeti
        } else if (window.innerWidth <= 768) {
            return 75; // Tablet için orta sayıda konfeti
        }
        return 100; // Masaüstü için çok konfeti
    }
    
    // Konfeti efekti oluşturma
    function createConfetti() {
        const confettiColors = ['#ff5252', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'];
        // Ekran boyutuna göre konfeti sayısını ayarla
        const confettiCount = getConfettiCount();
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            
            // Ekran boyutuna göre konfeti boyutunu ayarla
            const sizeFactor = window.innerWidth <= 480 ? 0.7 : 1;
            const size = (Math.random() * 10 + 5) * sizeFactor;
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.position = 'fixed';
            confetti.style.top = '-20px';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '6';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            confetti.style.pointerEvents = 'none';
            
            // Ekran boyutuna göre animasyon süresini ayarla
            const durationFactor = window.innerWidth <= 480 ? 0.8 : 1;
            const duration = (Math.random() * 3 + 2) * durationFactor;
            const delay = Math.random() * 0.5;
            
            confetti.style.animation = `confetti ${duration}s ease-in-out ${delay}s forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }
    }
    
    // Konfeti animasyonu için CSS ekle
    const confettiStyle = document.createElement('style');
    confettiStyle.innerHTML = `
        @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(720deg); }
        }
    `;
    document.head.appendChild(confettiStyle);
}); 