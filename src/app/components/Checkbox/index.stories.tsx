import React, { ComponentProps, useCallback, useState } from 'react';
import { Story } from '@storybook/react';

import { Checkbox } from './index';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
};

const Template: Story<ComponentProps<typeof Checkbox>> = args => (
  <Checkbox {...args} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Checkbox>> = args => {
  const [checked, setChecked] = useState(false);
  const onChange = useCallback(() => setChecked(!checked), [checked]);

  return <Checkbox {...args} checked={checked} onChange={onChange} />;
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'This is a simple checkbox',
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  label: 'Click me to toggle the checkbox',
};
