import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from './tailwind.config.js';

const config = resolveConfig(tailwindConfig);

const Swatch = ({ label, value, style }) => (
  <div className="tw-inline-block" style={style}>
    <span className="tw-inline-block tw-px-2 tw-mx-4 tw-my-2 tw-text-sov-white tw-bg-black tw-bg-opacity-75">
      {label}: {value}
    </span>
  </div>
);
export const TailwindTest = () => (
  <>
    <div>
      {Object.entries(config.theme.colors).map(([key, value]) => (
        <Swatch
          label={key}
          value={value}
          style={{ backgroundColor: value, width: '25%' }}
        />
      ))}
    </div>
    <pre className="tw-text-sov-white">{JSON.stringify(config, null, 2)}</pre>
  </>
);

export default {
  title: 'Design Guidelines',
};
