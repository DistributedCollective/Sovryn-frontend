import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { StorybookAnimatedBox } from './components/StorybookAnimatedBox';
import { H1 } from '../Heading/index';
import { StorybookTailwindUsage } from './components/StorybookTailwindUsage';

export default {
  title: 'Design Guide/Animations',
} as Meta;

const config = resolveConfig(tailwindConfig);

export const Animations = () => (
  <div>
    <H1>Animations</H1>
    <StorybookTailwindUsage
      text="tw-animate-{value}"
      documentationHref="https://tailwindcss.com/docs/animation"
    />
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
      {Object.entries<string>(config.theme.animation)
        .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
        .map(([key, value]) => (
          <StorybookAnimatedBox
            label={key}
            value={value}
            // need to prefix with tw-, because the tailwind animations are prefixed as well, but value isn't
            boxStyle={{ animation: `tw-${value}` }}
          />
        ))}
    </div>
  </div>
);
