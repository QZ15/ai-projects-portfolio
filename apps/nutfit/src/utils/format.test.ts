import { capitalize } from './format';

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('nutfit')).toBe('Nutfit');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });
});
