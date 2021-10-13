import { Story } from '@storybook/react';
import React, { ComponentProps } from 'react';
import { Input } from './index';

export default {
  title: 'Atoms/Input',
  component: Input,
};

const Template: Story<ComponentProps<typeof Input>> = args => (
  <Input {...args} />
);

export const TextInput = Template.bind({});
TextInput.args = {
  value: 'example input text',
  type: 'text',
};

export const NumberInput = Template.bind({});
NumberInput.args = {
  value: 13.37,
  step: 1,
  type: 'number',
};
