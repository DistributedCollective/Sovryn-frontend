import React, { ComponentProps, useCallback, useState } from 'react';
import { Story } from '@storybook/react';

import { Picture } from './index';
import { Breakpoint } from 'types/tailwind';

export default {
  title: 'Atoms/Picture',
  component: Picture,
};

const Template: Story<ComponentProps<typeof Picture>> = args => (
  <Picture {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  src: 'https://via.placeholder.com/1300x300.png',
  className: 'tw-mx-auto',
};

export const Multiple = Template.bind({});
Multiple.args = {
  src: 'https://via.placeholder.com/1300x300.png',
  srcSet: [
    {
      src: 'https://via.placeholder.com/576x300.png',
      media: Breakpoint.sm,
    },
    {
      src: 'https://via.placeholder.com/992x300.png',
      media: Breakpoint.md,
    },
    {
      src: 'https://via.placeholder.com/1200x300.png',
      media: Breakpoint.xl,
    },
    {
      src: 'https://via.placeholder.com/1536x300.png',
      media: Breakpoint._2xl,
    },
    {
      src: 'https://via.placeholder.com/1854x300.png',
      media: Breakpoint._3xl,
    },
  ],
  className: 'tw-mx-auto',
};
