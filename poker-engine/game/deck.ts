// // Constants
// SUITS = ['hearts', 'diamonds', 'clubs', 'spades']
// RANKS = ['2', '3', ..., '10', 'J', 'Q', 'K', 'A']
const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
export enum ranks {
    low_ace = 0,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    jack,
    queen,
    king,
    ace
}

// // card object
// card:
//   rank: string
//   suit: string
type Suit = typeof suits[number];
type Rank = ranks;

export type card = {
    suit: Suit;
    rank: Rank;
}

// // deck class
// class deck:
//   cards: list of card
class deck {
    private cards: card[] = [];

//   // Constructor
//   init():
//     cards = []
//     for each suit in SUITS:
//       for each rank in RANKS:
//         cards.append(new card(rank, suit))
    constructor() {
        this.init();
    }

    private init(): void {
        this.cards = [];
        for (const suit of suits) {
            for (const key in ranks) {
                const rank = ranks[key as keyof typeof ranks]
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
//       throw error("deck is empty")
//     return cards.pop()
    dealOne(): card {
        if (this.cards.length === 0) {
            throw new Error("deck is empty")
        }
        return this.cards.pop()!;
    }

//   // Deal multiple cards
//   dealMany(n):
//     if n > length(cards):
//       throw error("Not enough cards")
//     return [cards.pop() for _ in range(n)]
    dealMany(n: number): card[] {
        if (n > this.cards.length) {
            throw new Error("Not enough cards")
        }
        const dealt: card[] = [];
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