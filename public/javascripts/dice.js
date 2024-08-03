document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('rollButton');
    const dice = document.getElementById('dice');

    rollButton.addEventListener('click', () => {
        const randomX = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, 270 degrees
        const randomY = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, 270 degrees

        dice.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;
    });
});
