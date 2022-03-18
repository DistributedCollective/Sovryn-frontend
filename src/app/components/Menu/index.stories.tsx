import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Menu } from './index';
import { MenuItem } from './components/MenuItem';
import { faArchway } from '@fortawesome/free-solid-svg-icons';
import { MenuSeparator } from './components/MenuSeparator';

export default {
  title: 'Atoms/Menu',
  component: Menu,
  subcomponents: {
    MenuItem,
    MenuSeparator,
  },
};

const Template: Story<ComponentProps<typeof Menu>> = args => <Menu {...args} />;

export const _Menu = Template.bind({});
_Menu.args = {
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
    <MenuSeparator />,
    <MenuItem text="Delta" label="onClick" onClick={console.log} />,
    <MenuItem text="Epsilon" />,
    <MenuSeparator text="Zeta" />,
    <MenuItem text="Eta" label="href disabled" href="/" disabled />,
    <MenuItem
      text="Theta"
      label="href external disabled"
      href="https://sovryn.app"
      hrefExternal
      disabled
    />,
    <MenuItem
      text="Iota"
      label="onClick disabled"
      onClick={console.log}
      disabled
    />,
  ],
};

const MenuSeparatorTemplate: Story<ComponentProps<
  typeof MenuSeparator
>> = args => <MenuSeparator {...args} />;

export const _MenuSeparator = MenuSeparatorTemplate.bind({});
_MenuSeparator.args = {
  text: '',
};

const MenuItemTemplate: Story<ComponentProps<typeof MenuItem>> = args => (
  <MenuItem {...args} />
);

export const _MenuItem = MenuItemTemplate.bind({});
_MenuItem.args = {
  text: 'Text',
  label: 'label',
  icon: faArchway,
};
