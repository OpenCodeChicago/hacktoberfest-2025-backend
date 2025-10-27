//Tests for /models/cart.model.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Cart from '../src/models/cart.model.js';

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect and stop server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Cart model', () => {
  test('should create a cart with userId and default empty items', async () => {
    const cart = await Cart.create({ userId: 'user123' });
    expect(cart.userId).toBe('user123');
    expect(cart.items).toEqual([]);
  });

  test('should enforce min quantity for items', async () => {
    const cart = new Cart({
      userId: 'user456',
      items: [{ productId: new mongoose.Types.ObjectId(), quantity: 0 }],
    });

    const error = cart.validateSync();
    expect(error.errors['items.0.quantity'].message).toBe(
      'Path `quantity` (0) is less than minimum allowed value (1).'
    );
  });

  test('should allow adding items to cart', async () => {
    const cart = await Cart.create({
      userId: 'user789',
      items: [{ productId: new mongoose.Types.ObjectId(), quantity: 3 }],
    });

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(3);
  });
});
