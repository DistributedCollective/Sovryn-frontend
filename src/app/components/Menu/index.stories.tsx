import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Menu } from './index';
import { MenuItem } from './components/MenuItem';
import { faArchway } from '@fortawesome/free-solid-svg-icons';

export default {
  title: 'Atoms/Menu',
  component: Menu,
};

const Template: Story<ComponentProps<typeof Menu>> = args => <Menu {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  className: 'tw-max-w-xs',
  children: [
    <MenuItem text="Alpha" label="href" href="/" />,
    <MenuItem
      text="Beta"
      label="href external"
      href="https://sovryn.app"
      hrefExternal
    />,
    <MenuItem text="Gamma" label="with icon and label" icon={faArchway} />,
    <MenuItem text="Delta" />,
    <MenuItem text="Epsilon" />,
    <MenuItem text="Zeta" />,
    <MenuItem text="Eta" />,
    <MenuItem text="Theta" />,
  ],
};
