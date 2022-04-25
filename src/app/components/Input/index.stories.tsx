import { Story } from '@storybook/react';
import React, { ComponentProps, useState } from 'react';
import { Input } from './index';

export default {
  title: 'Atoms/Input',
  component: Input,
};

const Template: Story<ComponentProps<typeof Input>> = args => (
  <Input {...args} />
);

const AdvancedTemplate: Story<ComponentProps<typeof Input>> = args => {
  const [value, setValue] = useState('hello world');

  return (
    <div>
      <Input {...args} value={value} onChangeText={setValue} />
      <p>
        Value will change after {args.debounce}ms: {value}
      </p>
    </div>
  );
};

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

export const DebouncedInput = AdvancedTemplate.bind({});
DebouncedInput.args = {
  debounce: 300,
};
