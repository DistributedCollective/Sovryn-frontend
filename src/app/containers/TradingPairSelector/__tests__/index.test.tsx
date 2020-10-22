import React from 'react';
import { render } from '@testing-library/react';

import { TradingPairSelector } from '..';

const renderComponent = () => render(<TradingPairSelector />);

describe('<TradingPairSelector />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
