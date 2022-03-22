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

export const PictureWithString = Template.bind({});
PictureWithString.args = {
  src: 'https://placehold.co/1300x300.png',
  className: 'tw-flex tw-justify-center tw-my-5',
};

export const PictureWithObjects = Template.bind({});
PictureWithObjects.args = {
  src: 'https://via.placehold.co/1300x300.png',
  srcSet: [
    {
      src: [
        {
          imageSrc: 'https://placehold.co/576x300.png',
          width: Breakpoint.sm,
        },
        {
          imageSrc: 'https://placehold.co/768x300.png',
          width: Breakpoint.md,
        },
        {
          imageSrc: 'https://placehold.co/992x300.png',
          width: Breakpoint.lg,
        },
        {
          imageSrc: 'https://placehold.co/1200x300.png',
          width: Breakpoint.xl,
        },
        {
          imageSrc: 'https://placehold.co/1536x300.png',
          width: Breakpoint._2xl,
        },
        {
          imageSrc: 'https://placehold.co/1854x300.png',
          width: Breakpoint._3xl,
        },
      ],
    },
  ],
  className: 'tw-flex tw-justify-center tw-my-5',
};

export const PictureWithDensityAndWidth = Template.bind({});
PictureWithDensityAndWidth.args = {
  src: 'https://via.placehold.co/1300x300.png',
  srcSet: [
    {
      src: [
        {
          imageSrc: 'https://placehold.co/768x300.png',
          width: Breakpoint.md,
        },
        {
          imageSrc: 'https://placehold.co/1536x300@2x.png?text=1536x300+2x',
          density: 2,
        },
      ],
    },
  ],
  className: 'tw-flex tw-justify-center tw-my-5',
};

export const PictureWithMediaSources = Template.bind({});
PictureWithMediaSources.args = {
  src: 'https://placehold.co/1300x300.png',
  srcSet: [
    {
      src: 'https://placehold.co/576x300.png',
      media: Breakpoint.sm,
    },
    {
      src: 'https://placehold.co/768x300.png',
      media: Breakpoint.md,
    },
    {
      src: 'https://placehold.co/992x300.png',
      media: Breakpoint.lg,
    },
    {
      src: 'https://placehold.co/1200x300.png',
      media: Breakpoint.xl,
    },
    {
      src: 'https://placehold.co/1536x300.png',
      media: Breakpoint._2xl,
    },
    {
      src: 'https://placehold.co/1854x300.png',
      media: Breakpoint._3xl,
    },
  ],
  className: 'tw-flex tw-justify-center tw-my-5',
};
