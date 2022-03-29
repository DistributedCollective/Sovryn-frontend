import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { Swatch } from './components/Swatch';

export default {
  title: 'Design Guide/Borders',
} as Meta;

const config = resolveConfig(tailwindConfig);

console.log(config);

export const Borders = () => (
  <div>
    <H1>Borders</H1>
    <H2>Width</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-6">
      {Object.entries<string>(config.theme.borderWidth)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <Swatch
            label={key}
            value={value}
            className="tw-m-1 tw-bg-gray-4 tw-border-solid tw-border-sov-white"
            style={{ borderWidth: value }}
          />
        ))}
    </div>
    <H2>Radius</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-6">
      {Object.entries<string>(config.theme.borderRadius)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <Swatch
            label={key}
            value={value}
            className="tw-m-1 tw-bg-gray-4"
            style={{
              borderRadius: value,
            }}
          />
        ))}
    </div>
  </div>
);
