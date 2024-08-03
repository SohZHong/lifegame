
document.getElementById('rollButton').addEventListener('click', () => {
    fetch('/rollDice')
        .then(response => response.json())
        .then(data => {
            const diceImage = document.getElementById('diceImage');
            diceImage.src = `/images/dice${data.result}.png`;
        })
        .catch(error => console.error('Error:', error));
});
