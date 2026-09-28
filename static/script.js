// KIS Valentine Script
console.log("KIS Valentine loaded successfully.");

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Question Page Logic (Yes / No Buttons)
    const noBtn = document.getElementById("noBtn");
    const yesBtn = document.getElementById("yesBtn");
    const successModal = document.getElementById("successModal");

    if (noBtn && yesBtn) {
        let launching = false;
        const launchJourney = () => {
            if (launching) return;
            launching = true;
            const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
            const rect = noBtn.getBoundingClientRect();
            noBtn.disabled = true;
            yesBtn.disabled = true;
            noBtn.classList.add('vanishing');
            const status = document.getElementById('journeyStatus');
            status.textContent = '“Later” has left the chat. Your adventure starts now!';
            if (!reduced) {
                document.querySelector('.question-card').classList.add('dramatic-launch');
                for (let i = 0; i < 26; i++) {
                    const shard = document.createElement('span');
                    shard.className = 'journey-shard';
                    shard.setAttribute('aria-hidden', 'true');
                    shard.textContent = ['♡', '✦', '♥', '✧'][i % 4];
                    shard.style.left = (rect.left + rect.width / 2) + 'px';
                    shard.style.top = (rect.top + rect.height / 2) + 'px';
                    const angle = i / 26 * Math.PI * 2;
                    const distance = 65 + Math.random() * 135;
                    shard.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
                    shard.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
                    shard.style.setProperty('--spin', (Math.random() * 360 - 180) + 'deg');
                    document.body.appendChild(shard);
                    setTimeout(() => shard.remove(), 1400);
                }
            }
            setTimeout(() => window.location.assign(document.getElementById('journeyStatus').dataset.destination), reduced ? 1200 : 1800);
        };
        noBtn.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') launchJourney();
        });
        noBtn.addEventListener('click', launchJourney);

        yesBtn.addEventListener("click", () => {
            if (successModal) {
                successModal.classList.remove("hidden");
            }
        });
    }

    // 2. Mini-Game Logic
    const gameArena = document.getElementById("gameArena");
    const startGameBtn = document.getElementById("startGameBtn");
    const gameStartOverlay = document.getElementById("gameStartOverlay");
    const scoreCount = document.getElementById("scoreCount");
    const gameCompleteModal = document.getElementById("gameCompleteModal");

    if (gameArena && startGameBtn) {
        let score = 0;
        const targetScore = 10;
        let gameActive = false;

        const spawnHeart = () => {
            if (!gameActive || score >= targetScore) return;

            const heart = document.createElement("button");
            heart.classList.add("floating-target-heart");
            heart.setAttribute("aria-label", "Catch heart");
            heart.innerText = "💖";

            const arenaRect = gameArena.getBoundingClientRect();
            const maxX = arenaRect.width - 50;
            const maxY = arenaRect.height - 50;

            const randomX = Math.floor(Math.random() * Math.max(maxX, 10));
            const randomY = Math.floor(Math.random() * Math.max(maxY, 10));

            heart.style.left = `${randomX}px`;
            heart.style.top = `${randomY}px`;

            heart.addEventListener("click", () => {
                if (!gameActive) return;
                score++;
                scoreCount.innerText = score;
                heart.remove();

                if (score >= targetScore) {
                    gameActive = false;
                    if (gameCompleteModal) {
                        gameCompleteModal.classList.remove("hidden");
                    }
                } else {
                    spawnHeart();
                }
            });

            gameArena.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode === gameArena) {
                    heart.remove();
                    if (gameActive && score < targetScore) {
                        spawnHeart();
                    }
                }
            }, 1800);
        };

        startGameBtn.addEventListener("click", () => {
            score = 0;
            scoreCount.innerText = score;
            gameActive = true;
            if (gameStartOverlay) {
                gameStartOverlay.style.display = "none";
            }
            spawnHeart();
        });
    }

    // 3. Memory Cards Flip Logic
    const memoryCards = document.querySelectorAll(".memory-card");
    memoryCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
        });
    });

    // 4. Envelope Animation Logic
    const envelopeWrapper = document.getElementById("envelopeWrapper");
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener("click", () => {
            envelopeWrapper.classList.toggle("open");
        });
    }

});