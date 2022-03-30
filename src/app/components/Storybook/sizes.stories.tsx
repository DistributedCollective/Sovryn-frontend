import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { Table } from '../Table';
import { ColumnOptions } from '../Table/types';
import { Align } from '../../../types/index';

export default {
  title: 'Design Guide/Sizes',
} as Meta;

const config = resolveConfig(tailwindConfig);

const sortByPx = (a, b) => {
  let aPx = parseFloat(a.px);
  if (aPx < 0) {
    aPx = 1e9 - aPx;
  } else if (Number.isNaN(aPx)) {
    aPx = Number.POSITIVE_INFINITY;
  }
  let bPx = parseFloat(b.px);
  if (bPx < 0) {
    bPx = 1e9 - bPx;
  } else if (Number.isNaN(bPx)) {
    bPx = Number.POSITIVE_INFINITY;
  }
  return Math.sign(aPx - bPx) || a.name.localeCompare(b.name);
};

const percentageRows = [
  ['full'],
  ['1/2', '1/2'],
  ['1/3', '2/3'],
  ['1/4', '3/4'],
  ['2/4', '2/4'],
  ['1/5', '4/5'],
  ['2/5', '3/5'],
  ['1/6', '5/6'],
  ['2/6', '4/6'],
  ['3/6', '3/6'],
  ['1/12', '11/12'],
  ['2/12', '10/12'],
  ['3/12', '9/12'],
  ['4/12', '8/12'],
  ['5/12', '7/12'],
  ['6/12', '6/12'],
];

type BreakpointRowEntry = [string, string];

const breakpointRow: ColumnOptions<BreakpointRowEntry>[] = [
  { id: 0, title: 'name' },
  { id: 1, title: 'min width', align: Align.right },
];

const breakpointRows: BreakpointRowEntry[] = [
  ['xs', '0px'],
  ...Object.entries<string>(config.theme.screens),
];

type SizeRowEntry = {
  name: string;
  value: string;
  px: string;
  usableWith: string[];
};

const sizeColumns: ColumnOptions<SizeRowEntry>[] = [
  { id: 'name' },
  { id: 'value', align: Align.right },
  { id: 'px', align: Align.right },
  {
    id: 'usableWith',
    title: 'usable with',
    cellRenderer: row => row.usableWith.join(', '),
  },
];

const absoluteDimensionRows: SizeRowEntry[] = Object.entries<string>(
  config.theme.maxWidth,
)
  .filter(([key, value]) => !String(value).endsWith('%'))
  .map(([key, value]) => {
    let valueFloat = parseFloat(value);
    let px = '---';
    if (value.endsWith('rem')) {
      px = `${valueFloat * 16}px`;
    } else if (value.endsWith('px')) {
      px = value;
    }

    let usableWith = [
      config.theme.width[key] !== undefined ? 'width' : '',
      config.theme.minWidth[key] !== undefined ? 'min width' : '',
      config.theme.maxWidth[key] !== undefined ? 'max width' : '',
      config.theme.height[key] !== undefined ? 'height' : '',
      config.theme.minHeight[key] !== undefined ? 'min height' : '',
      config.theme.maxHeight[key] !== undefined ? 'max height' : '',
    ].filter(Boolean);

    if (usableWith.length === 6) {
      usableWith = ['all'];
    }

    return {
      name: key,
      value,
      px,
      usableWith,
    };
  })
  .sort(sortByPx);

const spacingRows: SizeRowEntry[] = Object.entries<string>(config.theme.margin)
  .map(([key, value]) => {
    let valueFloat = parseFloat(value);
    let px = '---';
    if (value.endsWith('rem')) {
      px = `${valueFloat * 16}px`;
    } else if (value.endsWith('px')) {
      px = value;
    }

    let usableWith = [
      config.theme.margin[key] !== undefined ? 'margin' : '',
      config.theme.padding[key] !== undefined ? 'padding' : '',
      config.theme.space[key] !== undefined ? 'space' : '',
      config.theme.gap[key] !== undefined ? 'gap' : '',
    ].filter(Boolean);

    if (usableWith.length === 4) {
      usableWith = ['all'];
    }

    return {
      name: key,
      value,
      px,
      usableWith,
    };
  })
  .sort(sortByPx);

export const Sizes = () => (
  <div className="tw-max-w-3xl">
    <H1>Sizes</H1>
    <H2>Breakpoints</H2>
    <p>
      These are the defined breakpoints used within the DApp. The minimal viable
      screen width is 320px.
    </p>
    <Table
      className="tw-max-w-3xl tw-max-h-96 tw-mb-12 tw-overflow-auto"
      columns={breakpointRow}
      rows={breakpointRows}
    />
    <H2>Relative Grid</H2>
    <p>
      Usable values for both widths and heights as min, max or explicitly. These
      are always relative to it's parent container.
    </p>
    <div className="tw-max-w-3xl tw-mb-12">
      {percentageRows.map(row => (
        <div className="tw-flex tw-flex-row tw-mb-2 tw-gap-2">
          {row.map(percentage => (
            <div
              className={`tw-box-border tw-px-2 tw-bg-gray-4 tw-w-${percentage}`}
            >
              {percentage}
            </div>
          ))}
        </div>
      ))}
    </div>
    <H2>Dimensions</H2>
    <p>
      Usable values for both widths and heights as min, max or explicitly.
      Exceptions are marked in the <em>usable with</em> column
    </p>
    <Table
      className="tw-max-w-3xl tw-max-h-96 tw-mb-12 tw-overflow-auto"
      columns={sizeColumns}
      rows={absoluteDimensionRows}
    />
    <H2>Spacings</H2>
    <p>
      Usable values for padding, margin, space and gap. Exceptions are marked in
      the <em>usable with</em> column
    </p>
    <Table
      className="tw-max-w-3xl tw-max-h-96 tw-mb-12 tw-overflow-auto"
      columns={sizeColumns}
      rows={spacingRows}
    />
  </div>
);
