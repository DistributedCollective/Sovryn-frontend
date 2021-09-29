import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Pagination } from './index';

export default {
  title: 'Atoms/Pagination',
  component: Pagination,
};

const Template: Story<ComponentProps<typeof Pagination>> = args => (
  <Pagination {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  totalRecords: 10,
  pageLimit: 1,
  pageNeighbours: 1,
};
