import React, { useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { StorybookTextSample } from './components/StorybookTextSample';
import classNames from 'classnames';

export default {
  title: 'Design Guide/Text',
} as Meta;

const config = resolveConfig(tailwindConfig);

export const Text = () => {
  const [font, setFont] = useState('tw-font-body');

  return (
    <div>
      <H1>Text</H1>
      <H2>Font Family</H2>
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
        {Object.entries<string>(config.theme.fontFamily)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <div
              className={classNames(
                'tw-box-border tw-w-1/3 tw-p-4 tw-cursor-pointer tw-duration-300 hover:tw-bg-gray-3',
                font.endsWith(key) && 'tw-bg-gray-3',
              )}
              onClick={() => setFont(`tw-font-${key}`)}
            >
              <StorybookTextSample
                className="tw-mb-auto"
                label={key}
                value={value}
                sampleClassName={`tw-mb-0 tw-text-base tw-font-${key}`}
              />
            </div>
          ))}
      </div>
      <H2>Font Size</H2>
      <div className="tw-flex tw-flex-col tw-mb-12">
        {Object.entries<string>(config.theme.fontSize)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <StorybookTextSample
              className="tw-w-full"
              label={key}
              value={value}
              sampleClassName={classNames(`tw-text-${key}`, font)}
            />
          ))}
      </div>
      <H2>Font Weight</H2>
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
        {Object.entries<string>(config.theme.fontWeight)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <StorybookTextSample
              className="tw-w-1/3"
              label={key}
              value={value}
              sampleClassName={classNames(`tw-text-base tw-font-${key}`, font)}
            />
          ))}
      </div>
      <H2>Tracking</H2>
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
        {Object.entries<string>(config.theme.letterSpacing)
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
          .map(([key, value]) => (
            <StorybookTextSample
              className="tw-w-1/3"
              label={key}
              value={value}
              sampleClassName={classNames(
                `tw-text-base tw-tracking-${key}`,
                font,
              )}
            />
          ))}
      </div>
      <H2>Leading</H2>
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
              value={value}
              sampleClassName={classNames(
                `tw-text-base tw-leading-${key}`,
                font,
              )}
              textLength={200}
            />
          ))}
      </div>
    </div>
  );
};
