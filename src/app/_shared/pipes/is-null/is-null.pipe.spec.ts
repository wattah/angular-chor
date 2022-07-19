import { IsNullPipe } from './is-null.pipe';

describe('IsNullPipe', () => {
  it('create an instance', () => {
    const pipe = new IsNullPipe();
    expect(pipe).toBeTruthy();
  });
});
