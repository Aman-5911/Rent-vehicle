import test from 'node:test';
import assert from 'node:assert/strict';
import { User } from '../src/models.js';

test('User schema accepts existing admin accounts', () => {
  assert.deepEqual(User.schema.path('role').enumValues, ['customer', 'owner', 'admin']);
});
