import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { FormGroup } from './index';
import { Input } from '../../components/Form/Input';

export default {
  title: 'Atoms/FormGroup',
  component: FormGroup,
};

const Template: Story<ComponentProps<typeof FormGroup>> = args => (
  <FormGroup {...args}>
    <Input value="9000 BTC" />
  </FormGroup>
);

export const Basic = Template.bind({});

Basic.args = {
  label: 'Input label',
  subLabel: 'Sublabel info',
  helperText: 'Super important text',
  labelInfo: '(required)',
  tooltipText:
    "Very important information that couldn't be ommitted and you need to read it",
};
