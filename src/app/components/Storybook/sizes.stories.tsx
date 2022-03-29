import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';

export default {
  title: 'Design Guide/Sizes',
} as Meta;

const config = resolveConfig(tailwindConfig);

const Swatch = ({ label, value, style }) => (
  <div className="tw-inline-block" style={style}>
    <span className="tw-inline-block tw-px-2 tw-mx-4 tw-my-2 tw-text-sov-white tw-bg-black tw-bg-opacity-75">
      {label}: {value}
    </span>
  </div>
);

export const Text = () => (
  <div>
    {Object.entries(config.theme.colors).map(([key, value]) => (
      <Swatch
        label={key}
        value={value}
        style={{ backgroundColor: value, width: '25%' }}
      />
    ))}
  </div>
);
