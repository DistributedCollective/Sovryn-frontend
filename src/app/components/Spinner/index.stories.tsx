import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Spinner } from './index';

export default {
  title: 'Atoms/Spinner',
  component: Spinner,
};

const Template: Story<ComponentProps<typeof Spinner>> = args => (
  <Spinner {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  size: 50,
};
