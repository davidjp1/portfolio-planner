import { queryAlphaVantageIntraday } from './alpha-vantage';
import { HttpException } from './http-exception';

jest.mock('firebase-admin', () => ({ firestore: jest.fn() }));

test('throws on invalid time series choice', async () => {
  let error: HttpException | null = null;
  try {
    await queryAlphaVantageIntraday('AAPL', 'invalid', true);
  } catch (e) {
    error = e as HttpException;
  }
  expect(error).toBeDefined();
  expect(error?.code).toBe(400);
  expect(error?.message).toContain('Invalid interval');
});
