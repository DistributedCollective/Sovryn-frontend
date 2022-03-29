import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { TextSample } from './components/TextSample';

export default {
  title: 'Design Guide/Text',
} as Meta;

const config = resolveConfig(tailwindConfig);

export const Text = () => (
  <div>
    <H1>Text</H1>
    <H2>Font Family</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-6">
      {Object.entries<string>(config.theme.fontFamily)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <TextSample
            className="tw-w-1/3"
            label={key}
            value={value}
            sampleClassName={`tw-text-base tw-font-${key}`}
          />
        ))}
    </div>
    <H2>Font Size</H2>
    <div className="tw-flex tw-flex-col tw-mb-6">
      {Object.entries<string>(config.theme.fontSize)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <TextSample
            className="tw-w-full"
            label={key}
            value={value}
            sampleClassName={`tw-text-${key}`}
          />
        ))}
    </div>
    <H2>Font Weight</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-6">
      {Object.entries<string>(config.theme.fontWeight)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <TextSample
            className="tw-w-1/3"
            label={key}
            value={value}
            sampleClassName={`tw-text-base tw-font-${key}`}
          />
        ))}
    </div>
    <H2>Tracking</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-6">
      {Object.entries<string>(config.theme.letterSpacing)
        .sort((a, b) => parseInt(String(a[1])) - parseInt(String(b[1])))
        .map(([key, value]) => (
          <TextSample
            className="tw-w-1/3"
            label={key}
            value={value}
            sampleClassName={`tw-text-base tw-tracking-${key}`}
          />
        ))}
    </div>
    <H2>Leading</H2>
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-6">
      {Object.entries<string>(config.theme.lineHeight)
        .sort((a, b) => {
          let av = parseFloat(String(a[1]));
          if (a[1].endsWith('rem')) {
            av *= 100;
          }
          let bv = parseFloat(String(b[1]));
          if (b[1].endsWith('rem')) {
            bv *= 100;
          }
          return av - bv;
        })
        .map(([key, value]) => (
          <TextSample
            className="tw-w-1/3"
            label={key}
            value={value}
            sampleClassName={`tw-text-base tw-leading-${key}`}
            textLength={200}
          />
        ))}
    </div>
  </div>
);
