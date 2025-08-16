import { generateProgressFeedback } from './progressFunctions';
import * as functions from 'firebase-functions';
const getUserMock = jest.fn();

jest.mock('firebase-functions', () => ({
  https: {
    onCall: (fn: any) => fn,
    HttpsError: class extends Error {
      code: string;
      constructor(code: string, message: string) {
        super(message);
        this.code = code;
      }
    },
  },
  logger: { error: jest.fn() },
}));

jest.mock('../services/openai.js', () => ({
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Great job!' } }],
      }),
    },
  },
}));

jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      doc: () => ({ get: getUserMock }),
    }),
  }),
}) as any);

describe('generateProgressFeedback', () => {
  it('returns feedback for premium user', async () => {
    getUserMock.mockResolvedValue({ data: () => ({ isPremium: true }) });
    const result = await (generateProgressFeedback as any)(
      {
        entries: [
          { date: '2023-01-01', weight: 80 },
          { date: '2023-01-08', weight: 81 },
        ],
      },
      { auth: { uid: 'u1' } }
    );
    expect(result).toEqual({ feedback: 'Great job!' });
  });

  it('throws HttpsError when no entries provided', async () => {
    getUserMock.mockResolvedValue({ data: () => ({ isPremium: true }) });
    await expect(
      (generateProgressFeedback as any)({ entries: [] }, { auth: { uid: 'u1' } })
    ).rejects.toBeInstanceOf(functions.https.HttpsError);
  });

  it('denies non-premium user', async () => {
    getUserMock.mockResolvedValue({ data: () => ({}) });
    await expect(
      (generateProgressFeedback as any)(
        {
          entries: [
            { date: '2023-01-01', weight: 80 },
            { date: '2023-01-08', weight: 81 },
          ],
        },
        { auth: { uid: 'u1' } }
      )
    ).rejects.toBeInstanceOf(functions.https.HttpsError);
  });

  it('requires authentication', async () => {
    await expect(
      (generateProgressFeedback as any)(
        {
          entries: [
            { date: '2023-01-01', weight: 80 },
            { date: '2023-01-08', weight: 81 },
          ],
        },
        {}
      )
    ).rejects.toBeInstanceOf(functions.https.HttpsError);
  });
});
