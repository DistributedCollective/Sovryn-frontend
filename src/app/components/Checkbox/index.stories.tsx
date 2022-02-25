import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Checkbox } from './index';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
};

const Template: Story<ComponentProps<typeof Checkbox>> = args => (
  <Checkbox {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  label: 'This is a simple checkbox',
};
