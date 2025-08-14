import { generateProgressFeedback } from './progressFunctions';
import * as functions from 'firebase-functions';

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

describe('generateProgressFeedback', () => {
  it('returns feedback from OpenAI', async () => {
    const result = await (generateProgressFeedback as any)({
      entries: [
        { date: '2023-01-01', weight: 80 },
        { date: '2023-01-08', weight: 81 },
      ],
    }, {});
    expect(result).toEqual({ feedback: 'Great job!' });
  });

  it('throws HttpsError when no entries provided', async () => {
    await expect(
      (generateProgressFeedback as any)({ entries: [] }, {})
    ).rejects.toBeInstanceOf(functions.https.HttpsError);
  });
});
