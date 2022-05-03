import React, { ComponentProps, useCallback, useState } from 'react';
import { Story } from '@storybook/react';

import { Overlay } from './index';
import { Button } from '../Button';

export default {
  title: 'Atoms/Overlay',
  component: Overlay,
};

const Template: Story<ComponentProps<typeof Overlay>> = args => (
  <Overlay {...args} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Overlay>> = args => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(open => !open), []);

  return (
    <div className="tw-relative tw-mx-auto tw-w-80 tw-h-80 tw-p-8 tw-bg-gray-3 tw-text-center">
      <Button onClick={toggleOpen} text="open" />
      <Overlay {...args} isOpen={open} onBlur={toggleOpen} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  portalTarget: 'body',
  children: 'Overlay Active',
  fixed: true,
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  portalTarget: 'body',
  children: 'Overlay Active',
};
