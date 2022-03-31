import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { StorybookSwatch } from './components/StorybookSwatch';

export default {
  title: 'Design Guide/Borders',
} as Meta;

const config = resolveConfig(tailwindConfig);

const addPxValue = (value: string) =>
  value.endsWith('rem') ? `${value} (${parseFloat(value) * 16}px)` : value;

export const Borders = () => (
  <div>
    <H1>Borders</H1>
    <H2>Width</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
      {Object.entries<string>(config.theme.borderWidth)
        .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
        .map(([key, value]) => (
          <StorybookSwatch
            label={key}
            value={value}
            className="tw-m-1 tw-bg-gray-4 tw-border-solid tw-border-sov-white"
            style={{ borderWidth: value }}
          />
        ))}
    </div>
    <H2>Radius</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
      {Object.entries<string>(config.theme.borderRadius)
        .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
        .map(([key, value]) => (
          <StorybookSwatch
            label={key}
            value={addPxValue(value)}
            className="tw-m-1 tw-bg-gray-4"
            style={{
              borderRadius: value,
            }}
          />
        ))}
    </div>
  </div>
);
