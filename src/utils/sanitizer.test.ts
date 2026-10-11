import test from 'node:test';
import assert from 'node:assert';
import { sanitizeTextInput } from './sanitizer.ts';

test('sanitizeTextInput should escape HTML special characters', () => {
  const dangerousInput = '<script>alert("xss")</script>';
  const clean = sanitizeTextInput(dangerousInput);
  assert.strictEqual(clean.includes('<script>'), false);
  assert.strictEqual(clean.includes('&lt;script&gt;'), true);
});

test('sanitizeTextInput should trim and truncate text to 30 characters', () => {
  const longInput = '   EsteTextoSuperaLosTreintaCaracteresPermitidos   ';
  const clean = sanitizeTextInput(longInput);
  assert.strictEqual(clean.length <= 30, true);
});

test('sanitizeTextInput should handle empty or null inputs gracefully', () => {
  assert.strictEqual(sanitizeTextInput(''), '');
  // @ts-expect-error test invalid type gracefully
  assert.strictEqual(sanitizeTextInput(null), '');
});
