import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../src/styles/sass/styles.scss';
import '../src/styles/tailwindcss/index.css';
import '@sovryn/react-wallet/index.css';

export const decorators = [
  Story => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
