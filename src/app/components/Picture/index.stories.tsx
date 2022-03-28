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
          imageSrc: 'https://placehold.co/600x300.png',
          width: 600,
        },
        {
          imageSrc: 'https://placehold.co/700x300.png',
          width: 700,
        },
        {
          imageSrc: 'https://placehold.co/900x300.png',
          width: 900,
        },
        {
          imageSrc: 'https://placehold.co/1200x300.png',
          width: 1200,
        },
        {
          imageSrc: 'https://placehold.co/1500x300.png',
          width: 1500,
        },
        {
          imageSrc: 'https://placehold.co/1800x300.png',
          width: 1800,
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
          imageSrc: 'https://placehold.co/900x300.png',
          width: 900,
        },
        {
          imageSrc: 'https://placehold.co/1536x300@2x.png?text=1536x300+2x',
          density: 2,
        },
        {
          imageSrc: 'https://placehold.co/1536x300@2x.png?text=1536x300+3x',
          density: 3,
        },
        {
          imageSrc: 'https://placehold.co/1536x300@2x.png?text=1536x300+4x',
          density: 4,
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
