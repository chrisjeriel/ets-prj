import { SafeTextPipe } from './safe-text.pipe';

describe('SafeTextPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeTextPipe();
    expect(pipe).toBeTruthy();
  });
});
