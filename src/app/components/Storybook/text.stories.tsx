import React, { useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { StorybookTextSample } from './components/StorybookTextSample';
import classNames from 'classnames';
import { StorybookTailwindUsage } from './components/StorybookTailwindUsage';

export default {
  title: 'Design Guide/Text',
} as Meta;

const config = resolveConfig(tailwindConfig);

// this is required to not loose the classes to the tailwind class cleanup.
const fonts = {
  body: 'tw-font-body',
  orbitron: 'tw-font-orbitron',
};

const fontsMissing = !Object.keys(config.theme.fontFamily).every(
  key => fonts[key],
);

const addPxValue = (value: string) =>
  value.endsWith('rem') ? `${value} (${parseFloat(value) * 16}px)` : value;

export const Text = () => {
  const [font, setFont] = useState(fonts.body);

  return (
    <div>
      <H1>Text</H1>
      <H2>Font Family</H2>
      {fontsMissing && (
        <p className="tw-text-warning tw-font-bold tw-text-xl">
          A font is missing! Tell a dev!
        </p>
      )}
      <StorybookTailwindUsage
        text="tw-font-{value}"
        documentationHref="https://tailwindcss.com/docs/font-family"
      />
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
        {Object.entries<string>(config.theme.fontFamily)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <div
              className={classNames(
                'tw-box-border tw-w-1/3 tw-p-4 tw-cursor-pointer tw-duration-300 hover:tw-bg-gray-3',
                font === fonts[key] && 'tw-bg-gray-3',
              )}
              onClick={() => setFont(fonts[key])}
            >
              <StorybookTextSample
                className="tw-mb-auto"
                label={key}
                value={value}
                sampleClassName={classNames('tw-mb-0 tw-text-base', fonts[key])}
              />
            </div>
          ))}
      </div>
      <H2>Font Size</H2>
      <StorybookTailwindUsage
        text="tw-text-{value}"
        documentationHref="https://tailwindcss.com/docs/font-size"
      />
      <div className="tw-flex tw-flex-col tw-mb-12">
        {Object.entries<string>(config.theme.fontSize)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <StorybookTextSample
              className="tw-w-full"
              label={key}
              value={addPxValue(value)}
              sampleClassName={font}
              sampleStyle={{ fontSize: value }}
            />
          ))}
      </div>
      <H2>Font Weight</H2>
      <StorybookTailwindUsage
        text="tw-font-{value}"
        documentationHref="https://tailwindcss.com/docs/font-weight"
      />
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
        {Object.entries<string>(config.theme.fontWeight)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <StorybookTextSample
              className="tw-w-1/3"
              label={key}
              value={value}
              sampleClassName={classNames('tw-text-base', font)}
              sampleStyle={{
                // value is just a string but fontWeight has specific definitions
                fontWeight: value as React.CSSProperties['fontWeight'],
              }}
            />
          ))}
      </div>
      <H2>Tracking</H2>
      <StorybookTailwindUsage
        text="tw-tracking-{value}"
        documentationHref="https://tailwindcss.com/docs/letter-spacing"
      />
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
        {Object.entries<string>(config.theme.letterSpacing)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <StorybookTextSample
              className="tw-w-1/3"
              label={key}
              value={value}
              sampleClassName={classNames('tw-text-base', font)}
              sampleStyle={{
                letterSpacing: value,
              }}
            />
          ))}
      </div>
      <H2>Leading</H2>
      <StorybookTailwindUsage
        text="tw-leading-{value}"
        documentationHref="https://tailwindcss.com/docs/line-height"
      />
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
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
            <StorybookTextSample
              className="tw-w-1/3"
              label={key}
              value={addPxValue(value)}
              sampleClassName={classNames('tw-text-base', font)}
              sampleStyle={{
                lineHeight: value,
              }}
              textLength={200}
            />
          ))}
      </div>
    </div>
  );
};
