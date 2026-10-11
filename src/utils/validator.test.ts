import test from 'node:test';
import assert from 'node:assert';
import { validateGameId, validateScoreInput } from './validator.ts';

test('validateGameId should pass for valid non-empty id', () => {
  const result = validateGameId('game-snake');
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.error, undefined);
});

test('validateGameId should fail for empty or whitespace id', () => {
  const result = validateGameId('   ');
  assert.strictEqual(result.isValid, false);
  assert.ok(result.error?.includes('requerido'));
});

test('validateScoreInput should validate playerName length and score value', () => {
  const valid = validateScoreInput({
    gameId: 'game-snake',
    playerName: 'Player1',
    score: 1500,
  });
  assert.strictEqual(valid.isValid, true);

  const invalidScore = validateScoreInput({
    gameId: 'game-snake',
    playerName: 'Player1',
    score: -10,
  });
  assert.strictEqual(invalidScore.isValid, false);

  const shortName = validateScoreInput({
    gameId: 'game-snake',
    playerName: 'P',
    score: 100,
  });
  assert.strictEqual(shortName.isValid, false);
});
