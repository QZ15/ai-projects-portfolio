import { setTesterAccess } from './tester';
import * as functions from 'firebase-functions';

const setMock = jest.fn();

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
}));

jest.mock('../admin.js', () => ({
  db: {
    collection: () => ({ doc: () => ({ set: setMock }) })
  }
}));

describe('setTesterAccess', () => {
  beforeEach(() => { setMock.mockReset(); });

  it('updates tester flag when caller is allowed', async () => {
    process.env.ALLOW_TESTER_ADMIN_UIDS = 'admin1';
    const res = await (setTesterAccess as any)({ uid: 'user1', value: true }, { auth: { uid: 'admin1' } });
    expect(setMock).toHaveBeenCalledWith({ isTester: true }, { merge: true });
    expect(res).toEqual({ ok: true });
  });

  it('rejects unauthorized caller', async () => {
    process.env.ALLOW_TESTER_ADMIN_UIDS = 'admin1';
    await expect((setTesterAccess as any)({ uid: 'user1', value: true }, { auth: { uid: 'user2' } }))
      .rejects.toBeInstanceOf(functions.https.HttpsError);
  });
});
