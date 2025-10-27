//Tests for controllers/collection.controller.js

import { getCollectionProducts } from '../src/controllers/collection.controller.js';
import Product from '../src/models/product.model.js';
import HttpException from '../src/utils/exceptions/http.exception.js';
import { tokenize, buildLookaheadRegex } from '../src/utils/regex.util.js';

jest.mock('../src/models/product.model.js'); // mock Product
jest.mock('../src/utils/regex.util.js'); // mock regex utils

describe('collection.controller.js', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('returns empty array when collection name is empty', async () => {
    req.params.name = '';
    await getCollectionProducts(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ collections: '', products: [] });
  });

  test('returns products when Product.find finds matching collections', async () => {
    req.params.name = 'Summer';
    const mockProducts = [{ name: 'Product A' }];
    Product.find.mockResolvedValue(mockProducts);

    await getCollectionProducts(req, res, next);

    expect(Product.find).toHaveBeenCalledWith({ collections: 'summer' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      collections: 'Summer',
      products: mockProducts,
    });
  });

  test('fallback with tokens and regex returns products', async () => {
    req.params.name = 'Cool Collection';
    Product.find.mockResolvedValueOnce([]); // first find returns nothing
    const mockProducts = [{ name: 'Product B' }];
    Product.find.mockResolvedValueOnce(mockProducts); // regex find returns products

    tokenize.mockReturnValue(['Cool', 'Collection']);
    buildLookaheadRegex.mockReturnValue(/some-regex/);

    await getCollectionProducts(req, res, next);

    expect(tokenize).toHaveBeenCalledWith('Cool Collection');
    expect(buildLookaheadRegex).toHaveBeenCalledWith(['Cool', 'Collection']);
    expect(Product.find).toHaveBeenCalledWith({
      collections: { $elemMatch: { $regex: /some-regex/ } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      collections: 'Cool Collection',
      products: mockProducts,
    });
  });

  test('returns 400 if query too complex', async () => {
    req.params.name = 'a b c d e f g'; // 7 tokens → exceeds 6
    Product.find.mockResolvedValueOnce([]); // exact match returns nothing
    tokenize.mockReturnValue(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

    await getCollectionProducts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      collections: 'a b c d e f g',
      products: [],
      message: 'Query too complex',
    });
  });

  test('calls next with HttpException on error', async () => {
    req.params.name = 'errorTest';
    Product.find.mockRejectedValue(new Error('DB failure'));

    await getCollectionProducts(req, res, next);

    expect(next).toHaveBeenCalled();
    const calledWith = next.mock.calls[0][0];
    expect(calledWith).toBeInstanceOf(HttpException);
    expect(calledWith.statusCode).toBe(500);
    expect(calledWith.message).toBe('Failed to fetch collections products');
  });
});
