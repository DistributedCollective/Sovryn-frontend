import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { StorybookSwatch } from './components/StorybookSwatch';
import { StorybookTailwindUsage } from './components/StorybookTailwindUsage';

export default {
  title: 'Design Guide/Colors',
} as Meta;

const config = resolveConfig(tailwindConfig);

export const Colors = () => (
  <div>
    <H1>Colors</H1>
    <StorybookTailwindUsage
      text={[
        'tw-text-{value}',
        'tw-bg-{value}',
        'tw-border-{value}',
        'tw-stroke-{value}',
        'tw-fill-{value}',
        'etc.',
      ]}
      documentationHref="https://tailwindcss.com/docs/text-color"
    />
    {Object.entries<string>(config.theme.colors)
      .reduce<any[]>((acc, [key, value]) => {
        const groupName = key.replace(/-\d+$/i, '');
        const group = acc.find(group => group.name === groupName);
        if (group) {
          group.entries.push([key, value]);
        } else {
          acc.push({ name: groupName, entries: [[key, value]] });
        }
        return acc;
      }, [])
      .map(({ name, entries }) => (
        <div key={name} className="tw-mb-12">
          <H2>{name}</H2>
          <div className="tw-flex tw-flex-row tw-flex-wrap">
            {entries.map(([key, value]) => (
              <StorybookSwatch
                label={key}
                value={value}
                style={{ backgroundColor: value }}
              />
            ))}
          </div>
        </div>
      ))}
  </div>
);
