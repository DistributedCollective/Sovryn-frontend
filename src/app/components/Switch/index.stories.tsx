import React, { ComponentProps, useCallback, useState } from 'react';
import { Story } from '@storybook/react';

import { Switch, SwitchAlignment } from './index';

export default {
  title: 'Atoms/Switch',
  component: Switch,
};

const Template: Story<ComponentProps<typeof Switch>> = args => (
  <Switch {...args} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Switch>> = args => {
  const [checked, setChecked] = useState(false);
  const onChange = useCallback(() => setChecked(!checked), [checked]);

  return <Switch {...args} checked={checked} onChange={onChange} />;
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Label for switch',
  alignment: SwitchAlignment.LEFT,
  innerLabel: '',
  innerLabelChecked: '',
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  label: 'Label for switch',
  alignment: SwitchAlignment.LEFT,
  innerLabel: '',
  innerLabelChecked: '',
};
