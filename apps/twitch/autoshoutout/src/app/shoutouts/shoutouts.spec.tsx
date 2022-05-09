import { render } from '@testing-library/react';

import Shoutouts from './shoutouts';

describe('Shoutouts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Shoutouts />);
    expect(baseElement).toBeTruthy();
  });
});
