// // Constants
// SUITS = ['hearts', 'diamonds', 'clubs', 'spades']
// RANKS = ['2', '3', ..., '10', 'J', 'Q', 'K', 'A']
const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"] as const;

// // Card object
// Card:
//   rank: string
//   suit: string
type Suit = typeof suits[number];
type Rank = typeof ranks[number];

type Card = {
    suit: Suit;
    rank: Rank;
}

// // Deck class
// class Deck:
//   cards: list of Card
class Deck {
    private cards: Card[] = [];

//   // Constructor
//   init():
//     cards = []
//     for each suit in SUITS:
//       for each rank in RANKS:
//         cards.append(new Card(rank, suit))
    constructor() {
        this.init();
    }

    private init(): void {
        this.cards = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push({rank, suit});
            }
        }
    }

//   // Shuffle using Fisher-Yates
//   shuffle():
//     for i from length(cards) - 1 down to 1:
//       j = random integer from 0 to i
//       swap cards[i] and cards[j]
    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (this.cards.length + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

//   // Deal one card
//   dealOne():
//     if cards is empty:
//       throw error("Deck is empty")
//     return cards.pop()
    dealOne(): Card {
        if (this.cards.length === 0) {
            throw new Error("Deck is empty")
        }
        return this.cards.pop()!;
    }

//   // Deal multiple cards
//   dealMany(n):
//     if n > length(cards):
//       throw error("Not enough cards")
//     return [cards.pop() for _ in range(n)]
    dealMany(n: number): Card[] {
        if (n > this.cards.length) {
            throw new Error("Not enough cards")
        }
        const dealt: Card[] = [];
        for (let i = 0; i < n; i++) {
            dealt.push(this.dealOne());
        }
        return dealt;
    }

//   // Reset deck to full 52 cards
//   reset():
//     call init()
    reset(): void {
        this.init();
    }
}