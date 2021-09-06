import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Table } from './index';
import { LinkToExplorer } from '../LinkToExplorer';

export default {
  title: 'Atoms/Table',
  component: Table,
};

const rowsSmall = [
  {
    key: 1,
    name: 'alpha',
    flag: false,
  },
  {
    key: 2,
    name: 'beta',
    flag: true,
  },
  {
    key: 3,
    name: 'gamma',
    flag: false,
  },
  {
    key: 4,
    name: 'delta',
    flag: true,
  },
];

const rowsLarge = new Array(20).fill(null).map((e, index) => ({
  key: index,
  name: String.fromCharCode('a'.charCodeAt(0) + index),
  source: '0x959919178CEff4a7bf5A1EdCEFFe2Eb965709d97',
  target: '0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3',
  progress: Math.random(),
  flag: Math.random() > 0.5,
}));

const Template: Story<ComponentProps<typeof Table>> = args => (
  <Table {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  columns: [
    {
      id: 'key',
      title: 'Key',
      align: 'right',
      className: 'tw-w-10',
    },
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'flag',
      title: 'Flag',
      cellRenderer: row => row.flag.toString(),
    },
  ],
  rows: rowsSmall,
};

export const NoData = Template.bind({});
NoData.args = {
  columns: [
    {
      id: 'key',
      title: 'Key',
    },
    {
      id: 'name',
      title: 'Name',
    },
  ],
  rows: [],
};

export const Full = Template.bind({});
Full.args = {
  className: 'tw-max-h-96',
  columns: [
    {
      id: 'key',
      title: 'Key',
    },
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'source',
      title: <span className="tw-text-secondary">Source</span>,
      cellRenderer: row => (
        <LinkToExplorer
          txHash={row.source}
          className="tw-text-secondary tw-font-normal tw-whitespace-nowrap"
        />
      ),
    },
    {
      id: 'target',
      title: <span className="tw-text-primary">Target</span>,
      cellRenderer: row => (
        <LinkToExplorer
          txHash={row.target}
          className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
        />
      ),
    },
    {
      id: 'progress',
      title: 'Progress',
      align: 'right',
      cellRenderer: row => Number(row.progress * 100).toPrecision(3) + '%',
    },
    {
      id: 'flag',
      title: 'Result',
      cellRenderer: row => (
        <input type="checkbox" checked={row.flag} disabled />
      ),
    },
    {
      id: 'actions',
      title: 'Actions',
      cellRenderer: row => (
        <div className="tw-space-x-4">
          <button>activate</button>
          <button>delete</button>
        </div>
      ),
    },
  ],
  rows: rowsLarge,
};

export const Responsive = Template.bind({});
Responsive.args = {
  className: 'tw-max-h-96',
  columns: [
    {
      id: 'key',
      title: 'Key',
      hideBelow: 'sm',
    },
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'source',
      title: <span className="tw-text-secondary">Source</span>,
      cellRenderer: row => (
        <LinkToExplorer
          txHash={row.source}
          className="tw-text-secondary tw-font-normal tw-whitespace-nowrap"
        />
      ),
      hideBelow: 'xl',
    },
    {
      id: 'target',
      title: <span className="tw-text-primary">Target</span>,
      cellRenderer: row => (
        <LinkToExplorer
          txHash={row.target}
          className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
        />
      ),
      hideBelow: 'xl',
    },
    {
      id: 'progress',
      title: 'Progress',
      align: 'right',
      cellRenderer: row => Number(row.progress * 100).toPrecision(3) + '%',
      hideBelow: '2xl',
    },
    {
      id: 'flag',
      title: 'Result',
      cellRenderer: row => (
        <input type="checkbox" checked={row.flag} disabled />
      ),
      hideBelow: '2xl',
    },
    {
      id: 'actions',
      title: 'Actions',
      cellRenderer: row => (
        <div className="tw-space-x-4">
          <button>activate</button>
          <button>delete</button>
        </div>
      ),
    },
  ],
  rows: rowsLarge,
  detailsTitle: 'Transaction Details',
  showDetails: true,
};
