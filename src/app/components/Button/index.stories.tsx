// YourComponent.stories.ts | YourComponent.stories.tsx

import React, { ComponentProps } from 'react';

import { Story, Meta } from '@storybook/react';

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonStyle,
  ButtonType,
} from './index';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta;

const Template: Story<ComponentProps<typeof Button>> = args => (
  <Button {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: 'Button',
  type: ButtonType.button,
  color: ButtonColor.primary,
  style: ButtonStyle.normal,
  size: ButtonSize.md,
};

export const LinkInternal = Template.bind({});
LinkInternal.args = {
  text: "Internal Link (Doesn't work in Storybook)",
  href: '/?path=/story/atoms-button--default',
  type: ButtonType.button,
  color: ButtonColor.primary,
  style: ButtonStyle.normal,
  size: ButtonSize.md,
};

export const LinkExternal = Template.bind({});
LinkExternal.args = {
  text: 'External Link',
  href: 'https://alpha.sovryn.app',
  hrefExternal: true,
  type: ButtonType.button,
  color: ButtonColor.primary,
  style: ButtonStyle.normal,
  size: ButtonSize.md,
};

const renderButton = (
  props,
  color: ButtonColor,
  style: ButtonStyle,
  size: ButtonSize,
) => (
  <div className="tw-flex-grow tw-w-1/5 tw-text-center">
    <Button
      {...props}
      color={color}
      style={style}
      size={size}
      text={[color, style, size].join(' ')}
    />
  </div>
);

const Variations = ({ color, ...props }) => (
  <>
    <div className="tw-flex tw-flex-row tw-justify-evenly tw-items-center tw-mb-4 tw-space-x-4">
      {renderButton(props, color, ButtonStyle.normal, ButtonSize.xl)}
      {renderButton(props, color, ButtonStyle.inverted, ButtonSize.xl)}
      {renderButton(props, color, ButtonStyle.transparent, ButtonSize.xl)}
      {renderButton(props, color, ButtonStyle.frosted, ButtonSize.xl)}
      {renderButton(props, color, ButtonStyle.link, ButtonSize.xl)}
    </div>
    <div className="tw-flex tw-flex-row tw-justify-evenly tw-items-center tw-mb-4 tw-space-x-4">
      {renderButton(props, color, ButtonStyle.normal, ButtonSize.lg)}
      {renderButton(props, color, ButtonStyle.inverted, ButtonSize.lg)}
      {renderButton(props, color, ButtonStyle.transparent, ButtonSize.lg)}
      {renderButton(props, color, ButtonStyle.frosted, ButtonSize.lg)}
      {renderButton(props, color, ButtonStyle.link, ButtonSize.lg)}
    </div>
    <div className="tw-flex tw-flex-row tw-justify-evenly tw-items-center tw-mb-4 tw-space-x-4">
      {renderButton(props, color, ButtonStyle.normal, ButtonSize.md)}
      {renderButton(props, color, ButtonStyle.inverted, ButtonSize.md)}
      {renderButton(props, color, ButtonStyle.transparent, ButtonSize.md)}
      {renderButton(props, color, ButtonStyle.frosted, ButtonSize.md)}
      {renderButton(props, color, ButtonStyle.link, ButtonSize.md)}
    </div>
    <div className="tw-flex tw-flex-row tw-justify-evenly tw-items-center tw-mb-4 tw-space-x-4">
      {renderButton(props, color, ButtonStyle.normal, ButtonSize.sm)}
      {renderButton(props, color, ButtonStyle.inverted, ButtonSize.sm)}
      {renderButton(props, color, ButtonStyle.transparent, ButtonSize.sm)}
      {renderButton(props, color, ButtonStyle.frosted, ButtonSize.sm)}
      {renderButton(props, color, ButtonStyle.link, ButtonSize.sm)}
    </div>
  </>
);

type AllVariationsProps = {
  loading: boolean;
  disabled: boolean;
  href: string;
  hrefExternal: boolean;
};

export const AllVariations: React.FC<AllVariationsProps> = props => (
  <>
    <Variations {...props} color={ButtonColor.primary} />
    <Variations {...props} color={ButtonColor.secondary} />
    <Variations {...props} color={ButtonColor.tradeLong} />
    <Variations {...props} color={ButtonColor.tradeShort} />
    <Variations {...props} color={ButtonColor.success} />
    <Variations {...props} color={ButtonColor.warning} />
  </>
);
