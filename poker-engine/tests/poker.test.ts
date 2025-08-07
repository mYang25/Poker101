import { evaluateHand, pokerHand } from '../game/handEvaluator';
import { ranks } from '../game/deck';

type card = {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: ranks;
};

// Helper function to make cards easier
const c = (rank: ranks, suit: card['suit']): card => ({ rank, suit });

describe('evaluateHand', () => {
  it('detects a Royal Flush', () => {
    const hand = [
      c(ranks.ten, 'hearts'),
      c(ranks.jack, 'hearts'),
      c(ranks.queen, 'hearts'),
      c(ranks.king, 'hearts'),
      c(ranks.ace, 'hearts'),
      c(ranks.two, 'clubs'),
      c(ranks.three, 'spades')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.royalFlush);
  });

  it('detects a Straight Flush', () => {
    const hand = [
      c(ranks.nine, 'spades'),
      c(ranks.ten, 'spades'),
      c(ranks.jack, 'spades'),
      c(ranks.queen, 'spades'),
      c(ranks.king, 'spades'),
      c(ranks.two, 'hearts'),
      c(ranks.four, 'clubs')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.straightFlush);
  });

  it('detects Four of a Kind', () => {
    const hand = [
      c(ranks.five, 'hearts'),
      c(ranks.five, 'clubs'),
      c(ranks.five, 'diamonds'),
      c(ranks.five, 'spades'),
      c(ranks.king, 'spades'),
      c(ranks.three, 'hearts'),
      c(ranks.two, 'clubs')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.quads);
  });

  it('detects a Full House', () => {
    const hand = [
      c(ranks.six, 'hearts'),
      c(ranks.six, 'diamonds'),
      c(ranks.six, 'clubs'),
      c(ranks.three, 'hearts'),
      c(ranks.three, 'spades'),
      c(ranks.four, 'clubs'),
      c(ranks.two, 'clubs')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.fullHouse);
  });

  it('detects a Flush', () => {
    const hand = [
      c(ranks.two, 'hearts'),
      c(ranks.five, 'hearts'),
      c(ranks.seven, 'hearts'),
      c(ranks.jack, 'hearts'),
      c(ranks.king, 'hearts'),
      c(ranks.three, 'spades'),
      c(ranks.four, 'clubs')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.flush);
  });

  it('detects a Straight', () => {
    const hand = [
      c(ranks.six, 'hearts'),
      c(ranks.seven, 'diamonds'),
      c(ranks.eight, 'clubs'),
      c(ranks.nine, 'spades'),
      c(ranks.ten, 'hearts'),
      c(ranks.two, 'clubs'),
      c(ranks.king, 'spades')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.straight);
  });

  it('detects Three of a Kind', () => {
    const hand = [
      c(ranks.four, 'hearts'),
      c(ranks.four, 'clubs'),
      c(ranks.four, 'spades'),
      c(ranks.king, 'hearts'),
      c(ranks.nine, 'diamonds'),
      c(ranks.six, 'clubs'),
      c(ranks.two, 'diamonds')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.trips);
  });

  it('detects Two Pair', () => {
    const hand = [
      c(ranks.jack, 'hearts'),
      c(ranks.jack, 'diamonds'),
      c(ranks.six, 'clubs'),
      c(ranks.six, 'spades'),
      c(ranks.queen, 'hearts'),
      c(ranks.ten, 'clubs'),
      c(ranks.four, 'spades')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.twoPair);
  });

  it('detects One Pair', () => {
    const hand = [
      c(ranks.ace, 'hearts'),
      c(ranks.ace, 'spades'),
      c(ranks.ten, 'diamonds'),
      c(ranks.seven, 'clubs'),
      c(ranks.four, 'spades'),
      c(ranks.six, 'hearts'),
      c(ranks.nine, 'clubs')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.onePair);
  });

  it('detects High Card', () => {
    const hand = [
      c(ranks.two, 'hearts'),
      c(ranks.five, 'clubs'),
      c(ranks.seven, 'diamonds'),
      c(ranks.nine, 'spades'),
      c(ranks.jack, 'hearts'),
      c(ranks.king, 'clubs'),
      c(ranks.three, 'diamonds')
    ];
    const result = evaluateHand(hand);
    expect(result.rank).toBe(pokerHand.highCard);
  });
});