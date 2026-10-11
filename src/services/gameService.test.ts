import test from 'node:test';
import assert from 'node:assert';
import { getAllGames, getGameById, getGamesByCategory } from './gameService.ts';

test('getAllGames should return catalog of 10 retro games', async () => {
  const games = await getAllGames();
  assert.strictEqual(Array.isArray(games), true);
  assert.strictEqual(games.length, 10);
});

test('getGameById should find snake game correctly', async () => {
  const game = await getGameById('game-snake');
  assert.ok(game);
  assert.strictEqual(game?.slug, 'snake');
});

test('getGameById should return null for non-existing id', async () => {
  const game = await getGameById('inexistente-123');
  assert.strictEqual(game, null);
});

test('getGamesByCategory should filter arcade games correctly', async () => {
  const arcades = await getGamesByCategory('arcade');
  assert.strictEqual(Array.isArray(arcades), true);
  assert.ok(arcades.length > 0);
  assert.ok(arcades.every((g) => g.category === 'arcade'));
});
