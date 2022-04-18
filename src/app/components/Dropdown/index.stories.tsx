import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { Dropdown } from './index';

export default {
  title: 'Atoms/Dropdown',
  component: Dropdown,
};

const Template: Story<ComponentProps<typeof Dropdown>> = args => (
  <>
    <Dropdown {...args} />
  </>
);

export const Basic = Template.bind({});
Basic.args = {
  text: 'Dropdown Button',
  children: (
    <>
      <div onClick={() => alert('Click on the Dropdown Item 1')}>
        Dropdown Item 1
      </div>
      <div onClick={() => alert('Click on the Dropdown Item 2')}>
        Dropdown Item 2
      </div>
      <div onClick={() => alert('Click on the Dropdown Item 3')}>
        Dropdown Item 3
      </div>
    </>
  ),
};
