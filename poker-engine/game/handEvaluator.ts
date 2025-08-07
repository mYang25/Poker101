import { ranks } from './deck';

export type card = {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: ranks;
};

export enum pokerHand {
    highCard = 1,
    onePair,
    twoPair,
    trips,
    straight,
    flush,
    fullHouse,
    quads,
    straightFlush,
    royalFlush
}

type evaluatedHand = {
    rank: pokerHand;
    cards: card[];
    kickers?: card[];
}

//helper function for evaluateHand()
function combinations<T>(arr: T[], k: number): T[][] {
    const result: T[][] = [];

    function backtrack(start: number, path: T[]) {
        if (path.length === k) {
            result.push([...path])
            return;
        }
    

        for (let i = start; i <= arr.length - (k - path.length); i++) {
            path.push(arr[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }

    backtrack(0, []);
    return result;
}

//given all 7 poker cards, return the best 5-card hand
export function evaluateHand(c: card[]): evaluatedHand {
    if (c.length != 7) throw new Error("evaluateHand requires 7 cards.");

    let bestHand: evaluatedHand | null = null;

    const cardCombos = combinations(c, 5);

    for (const combo of cardCombos) {
        const current  = evaluateFiveCardHand(combo);

        if (!bestHand || current.rank > bestHand.rank) bestHand = current;
        else if (current.rank === bestHand.rank) {
            const result = compareTieBreakers(current, bestHand);
            if (result === 0) bestHand = current;
        }
    }

    if (!bestHand) throw new Error("No valid hand found.");
    return bestHand;
}


// returns a number corresponding to the correct bestHand
// 0 -> curr
// 1 -> best
// 2 -> tie
function compareTieBreakers(curr: evaluatedHand, best: evaluatedHand): number {
    const sortedCurr = [...curr.cards].sort((a, b) => b.rank - a.rank);
    const sortedBest = [...best.cards].sort((a, b) => b.rank - a.rank);

    for (let i = 0; i < 5; i++) {
        if (sortedCurr[i].rank > sortedBest[i].rank) return 0;
        if (sortedCurr[i].rank < sortedBest[i].rank) return 1;
    }
    
    if (curr.kickers && best.kickers) {
        const kc = [...curr.kickers].sort((a, b) => b.rank - a.rank);
        const kb = [...best.kickers].sort((a, b) => b.rank - a.rank);
        for (let i = 0; i < Math.min(kc.length, kb.length); i++) {
            if (kc[i].rank > kb[i].rank) return 0;
            if (kc[i].rank < kb[i].rank) return 1;
        }
    }

    return 2;
}

// helper function for evaluateHand()
// return the rank of the given 5-card hand
function evaluateFiveCardHand(hand: card[]): evaluatedHand {
    if (isRoyalFlush(hand)) {
        return { rank: pokerHand.royalFlush, cards: hand };
    }

    if (isStraightFlush(hand)) {
        return { rank: pokerHand.straightFlush, cards: hand };
    }

    if (isQuads(hand)) {
        return {
            rank: pokerHand.quads,
            cards: hand,
            kickers: handKickers(hand, pokerHand.quads)
        };
    }

    if (isFullHouse(hand)) {
        return { rank: pokerHand.fullHouse, cards: hand };
    }

    if (isFlush(hand)) {
        return { rank: pokerHand.flush, cards: hand };
    }

    if (isStraight(hand)) {
        return { rank: pokerHand.straight, cards: hand };
    }

    if (isTrips(hand)) {
        return {
            rank: pokerHand.trips,
            cards: hand,
            kickers: handKickers(hand, pokerHand.trips)
        };
    }

    if (isTwoPair(hand)) {
        return {
            rank: pokerHand.twoPair,
            cards: hand,
            kickers: handKickers(hand, pokerHand.twoPair)
        };
    }

    if (isOnePair(hand)) {
        return {
            rank: pokerHand.onePair,
            cards: hand,
            kickers: handKickers(hand, pokerHand.onePair)
        };
    }

    return {
        rank: pokerHand.highCard,
        cards: hand,
        kickers: handKickers(hand, pokerHand.highCard)
    };
}

// helper functions for evaluateFiveCardHand()
function handKickers(hand: card[], handType: pokerHand): card[] {
    // Count card ranks
    const rankCounts = new Map<number, card[]>();
    for (const card of hand) {
        const cards = rankCounts.get(card.rank) ?? [];
        cards.push(card);
        rankCounts.set(card.rank, cards);
    }

    let mainCards: card[] = [];

    switch (handType) {
        case pokerHand.royalFlush:
        case pokerHand.straightFlush:
        case pokerHand.straight:
        case pokerHand.flush:
        case pokerHand.fullHouse:
            // These hands don't use kickers for tie-breaking (or use internal logic)
            return [];

        case pokerHand.quads: {
            // Find the 4-of-a-kind
            for (const group of rankCounts.values()) {
                if (group.length === 4) {
                    mainCards = group;
                    break;
                }
            }
            break;
        }

        case pokerHand.trips: {
            for (const group of rankCounts.values()) {
                if (group.length === 3) {
                    mainCards = group;
                    break;
                }
            }
            break;
        }

        case pokerHand.twoPair: {
            let pairs: card[][] = [];
            for (const group of rankCounts.values()) {
                if (group.length === 2) {
                    pairs.push(group);
                }
            }
            // Use top 2 pairs only
            pairs.sort((a, b) => b[0].rank - a[0].rank);
            mainCards = [...pairs[0], ...pairs[1]];
            break;
        }

        case pokerHand.onePair: {
            for (const group of rankCounts.values()) {
                if (group.length === 2) {
                    mainCards = group;
                    break;
                }
            }
            break;
        }

        case pokerHand.highCard: {
            // No main group, just sort and pick top 5 as hand
            return hand
                .slice()
                .sort((a, b) => b.rank - a.rank)
                .slice(1); // Top card is "high card", the rest are kickers
        }
    }

    // All other cards not in main hand are potential kickers
    const kickerCandidates = hand.filter(card => !mainCards.includes(card));
    kickerCandidates.sort((a, b) => b.rank - a.rank);
    return kickerCandidates;
}

function isRoyalFlush(hand: card[]): boolean {
    const requiredRanks = [
        ranks.ten,
        ranks.jack,
        ranks.queen,
        ranks.king,
        ranks.ace
    ];

    const firstSuit = hand[0].suit;
    const allSameSuit = hand.every(card => card.suit === firstSuit);

    if (!allSameSuit) return false;

    const handRanks = hand.map(card => card.rank);
    const hasAllRanks = requiredRanks.every(r => handRanks.includes(r));

    return hasAllRanks;
}

function isStraightFlush(hand: card[]): boolean {
    if (isStraight(hand) && isFlush(hand)) {
        return true;
    }
    return false;
}

function isQuads(hand: card[]): boolean {
    const rankCounts = new Map<ranks, number>();

    for (const card of hand) {
        const count = rankCounts.get(card.rank) ?? 0;
        rankCounts.set(card.rank, count + 1);
    }

    for (const cnt of rankCounts.values()) {
        if (cnt === 4) {
            return true;
        }
    }
    return false;
}

function isFullHouse(hand: card[]): boolean {
    const rankCounts = new Map<ranks, number>();
    let hasTrips = false;
    let hasPair = false;

    for (const card of hand) {
        const count = rankCounts.get(card.rank) ?? 0;
        rankCounts.set(card.rank, count + 1);
    }

    for (const cnt of rankCounts.values()) {
        if (cnt === 3) {
            hasTrips = true;
        }
        else if (cnt === 2) {
            hasPair = true;
        }
    }
    return (hasTrips && hasPair);
}

function isFlush(hand: card[]): boolean {
    const suitCounts = new Map<string, number>();

    for (const card of hand) {
        const count = suitCounts.get(card.suit) ?? 0;
        suitCounts.set(card.suit, count + 1);
    }

    for (const count of suitCounts.values()) {
        if (count === 5) {
            return true;
        }
    }

    return false;
}

function isStraight(hand: card[]): boolean {
    const rankCounts = new Map<ranks, number>();

    for (const card of hand) {
        const count = rankCounts.get(card.rank) ?? 0;
        rankCounts.set(card.rank, count + 1);
    }

    let uniqueRanks = Array.from(rankCounts.keys());

    if (uniqueRanks.includes(13)) {
        uniqueRanks.push(0);
    }

    uniqueRanks.sort((a, b) => a - b);

    let consecutive = 1;
    for (let i = 1; i < uniqueRanks.length; i++) {
        if (uniqueRanks[i] === uniqueRanks[i - 1] + 1) {
            consecutive++;
            if (consecutive === 5) return true;
        } else if (uniqueRanks[i] !== uniqueRanks[i - 1]) {
            consecutive = 1; 
        }
    }

    return false;
}

function isTrips(hand: card[]): boolean {
    const rankCounts = new Map<ranks, number>();

    for (const card of hand) {
        const count = rankCounts.get(card.rank) ?? 0;
        rankCounts.set(card.rank, count + 1)
    }

    for (const cnt of rankCounts.values()) {
        if (cnt === 3) {
            return true;
        }
    }
    return false;
}

function isTwoPair(hand: card[]): boolean {
    const rankCounts = new Map<ranks, number>();

    for (const card of hand) {
        const count = rankCounts.get(card.rank) ?? 0;
        rankCounts.set(card.rank, count + 1);
    }

    let pairCount = 0;

    for (const cnt of rankCounts.values()) {
        if (cnt === 2) {
            pairCount++;
        }
    }

    return pairCount >= 2;
}

function isOnePair(hand: card[]): boolean {
    const rankCounts = new Map<ranks, number>();

    for (const card of hand) {
        const count = rankCounts.get(card.rank) ?? 0;
        rankCounts.set(card.rank, count + 1);
    }

    let pairs = 0;
    for (const count of rankCounts.values()) {
        if (count === 2) pairs++;
        else if (count > 2) return false;
    }

    return pairs === 1;
}

function isHighCard(hand: card[]): boolean {
    return (
        !isOnePair(hand) &&
        !isTwoPair(hand) &&
        !isTrips(hand) &&
        !isStraight(hand) &&
        !isFlush(hand) &&
        !isFullHouse(hand) &&
        !isQuads(hand) &&
        !isStraightFlush(hand) &&
        !isRoyalFlush(hand)
    );
}

