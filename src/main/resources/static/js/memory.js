
class Memory {

    constructor(cards) {

        // Double cards for match making
        this.cards = cards.concat(cards);

        this.resetBoard();
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();

    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    shuffleElements() {
        // Durstenfeld
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    createElements() {
        
        this.res = "";

        this.cards.forEach((card) => {
            this.res += `
                <article data-element="${card.element}">
                    <h3>Memory Card</h3>
                    <img src="${card.source}" alt="${card.element}">
                </article>
            `;
        })

        document.write(this.res);

    }

    addEventListeners() {

        // Add event listener to every article
        document.querySelectorAll("article").forEach((article) => {
            article.addEventListener("click", () => {
                this.flipCard(article);
            });
        });

    }

    flipCard(clickedCard) {

        if (this.lockBoard) return;
        if (this.secondCard != null) return;
        if (clickedCard === this.firstCard) return;
        if (clickedCard.dataset.state == 'revealed') return;

        clickedCard.dataset.state = 'flip';

        if (!this.hasFlippedCard) {
            // First card flipped
            this.hasFlippedCard = true;
            this.firstCard = clickedCard;
        } else {
            // Second card flipped
            this.secondCard = clickedCard;
            this.checkForMatch();
        }
    }

    unflipCards() {
        setTimeout(() => {
            this.firstCard.removeAttribute('data-state');
            this.secondCard.removeAttribute('data-state');
            this.resetBoard();
        }, 1000);
        this.lockBoard = false;
    }

    disableCards() {
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();
    }

    checkForMatch() {
        this.lockBoard = true;
        (this.firstCard.dataset.element === this.secondCard.dataset.element) ? this.disableCards() : this.unflipCards();
    }

}