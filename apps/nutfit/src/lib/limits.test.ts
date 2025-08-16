import { checkUsageLimit } from './limits';
import { getDoc } from 'firebase/firestore';

jest.mock('../services/firebase', () => ({
  auth: { currentUser: { uid: 'u1' } },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

const getDocMock = getDoc as unknown as jest.Mock;

describe('checkUsageLimit', () => {
  beforeEach(() => {
    getDocMock.mockReset();
  });

  it('allows when under limit', async () => {
    getDocMock.mockResolvedValue({ data: () => ({ meal: 2 }) });
    await expect(checkUsageLimit('meal')).resolves.toBeUndefined();
  });

  it('throws when limit reached', async () => {
    getDocMock.mockResolvedValue({ data: () => ({ meal: 3 }) });
    await expect(checkUsageLimit('meal')).rejects.toThrow('Limit reached');
  });
});
