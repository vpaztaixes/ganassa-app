// TODO: Implement
// Team page: Card entry animations
function animateCards() {
    const cards = document.querySelectorAll('.player-card-simple');
    const coachCard = document.querySelector('.coach-card');

    // Animate coach first
    if (coachCard) {
        coachCard.style.opacity = '0';
        coachCard.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            coachCard.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            coachCard.style.opacity = '1';
            coachCard.style.transform = 'translateX(0)';
        }, 300);
    }

    // Goalkeeper
    if (cards[0]) {
        setTimeout(() => {
            cards[0].style.animation = 'cardAppear 0.6s ease-out forwards';
        }, 400);
    }

    // Defenders
    for (let i = 1; i <= 4; i++) {
        if (cards[i]) {
            setTimeout(() => {
                cards[i].style.animation = `cardAppear 0.6s ease-out ${(i-1)*0.2}s forwards`;
            }, 600 + (i-1)*200);
        }
    }

    // Rest of team
    for (let i = 5; i < cards.length; i++) {
        if (cards[i]) {
            setTimeout(() => {
                cards[i].style.animation = `cardAppear 0.6s ease-out ${(i-5)*0.15}s forwards`;
            }, 1400 + (i-5)*150);
        }
    }
}

// Trigger after preloader finishes (event from main.js)
document.addEventListener('ganassa:loaded', () => {
    setTimeout(animateCards, 300);
});