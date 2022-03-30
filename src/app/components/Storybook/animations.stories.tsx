import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { StorybookAnimatedBox } from './components/StorybookAnimatedBox';
import { H1 } from '../Heading/index';

export default {
  title: 'Design Guide/Animations',
} as Meta;

const config = resolveConfig(tailwindConfig);

export const Animations = () => (
  <div>
    <H1>Animations</H1>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
      {Object.entries<string>(config.theme.animation)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <StorybookAnimatedBox
            label={key}
            value={value}
            boxClassName={`tw-animate-${key}`}
          />
        ))}
    </div>
  </div>
);
