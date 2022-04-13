import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading';
import { Table } from '../Table';
import { ColumnOptions } from '../Table/types';
import { Align } from '../../../types/index';
import classNames from 'classnames';
import { StorybookTailwindUsage } from './components/StorybookTailwindUsage';

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
  ['tw-w-full'],
  ['tw-w-1/2', 'tw-w-1/2'],
  ['tw-w-1/3', 'tw-w-2/3'],
  ['tw-w-1/4', 'tw-w-3/4'],
  ['tw-w-2/4', 'tw-w-2/4'],
  ['tw-w-1/5', 'tw-w-4/5'],
  ['tw-w-2/5', 'tw-w-3/5'],
  ['tw-w-1/6', 'tw-w-5/6'],
  ['tw-w-2/6', 'tw-w-4/6'],
  ['tw-w-3/6', 'tw-w-3/6'],
  ['tw-w-1/12', 'tw-w-11/12'],
  ['tw-w-2/12', 'tw-w-10/12'],
  ['tw-w-3/12', 'tw-w-9/12'],
  ['tw-w-4/12', 'tw-w-8/12'],
  ['tw-w-5/12', 'tw-w-7/12'],
  ['tw-w-6/12', 'tw-w-6/12'],
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

const breakpointUnionString = Object.keys(config.theme.screens).join('|');

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
    <StorybookTailwindUsage
      text={[
        `[${breakpointUnionString}]:tw-{className}`,
        `@screen [${breakpointUnionString}] {}`,
      ]}
      documentationHref="https://tailwindcss.com/docs/responsive-design"
    />
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
    <StorybookTailwindUsage
      text={['tw-[w|min-w|max-w]-{value}', 'tw-[h|min-h|max-h]-{value}']}
      documentationHref="https://tailwindcss.com/docs/width"
    />
    <div className="tw-max-w-3xl tw-mb-12">
      {percentageRows.map(row => (
        <div className="tw-flex tw-flex-row tw-mb-2 tw-gap-2">
          {row.map(className => (
            <div
              className={classNames(
                'tw-box-border tw-px-2 tw-bg-gray-4',
                className,
              )}
            >
              {className.replace('tw-w-', '')}
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
    <StorybookTailwindUsage
      text={['tw-[w|min-w|max-w]-{value}', 'tw-[h|min-h|max-h]-{value}']}
      documentationHref="https://tailwindcss.com/docs/width"
    />
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
    <StorybookTailwindUsage
      text={[
        'tw-[p|px|py|pt|pb|pl|pr]-{value}',
        'tw-[m|mx|my|mt|mb|ml|mr]-{value}',
        'tw-[gap|gap-x|gap-y]-{value}',
        'tw-[space|space-x|space-y]-{value}',
      ]}
      documentationHref="https://tailwindcss.com/docs/padding"
    />
    <Table
      className="tw-max-w-3xl tw-max-h-96 tw-mb-12 tw-overflow-auto"
      columns={sizeColumns}
      rows={spacingRows}
    />
  </div>
);
