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
  text: 'Button Text',
  type: ButtonType.button,
  color: ButtonColor.primary,
  style: ButtonStyle.normal,
  size: ButtonSize.md,
};

const renderButton = (
  color: ButtonColor,
  style: ButtonStyle,
  size: ButtonSize,
) => (
  <Button
    color={color}
    style={style}
    size={size}
    text={[color, style, size].join(' ')}
  />
);

const bindRenderVariations = (color: ButtonColor) => () => {
  return (
    <>
      <div className="tw-mb-4 tw-space-x-4">
        {renderButton(color, ButtonStyle.normal, ButtonSize.lg)}
        {renderButton(color, ButtonStyle.inverted, ButtonSize.lg)}
        {renderButton(color, ButtonStyle.transparent, ButtonSize.lg)}
        {renderButton(color, ButtonStyle.frosted, ButtonSize.lg)}
        {renderButton(color, ButtonStyle.link, ButtonSize.lg)}
      </div>
      <div className="tw-mb-4 tw-space-x-4">
        {renderButton(color, ButtonStyle.normal, ButtonSize.md)}
        {renderButton(color, ButtonStyle.inverted, ButtonSize.md)}
        {renderButton(color, ButtonStyle.transparent, ButtonSize.md)}
        {renderButton(color, ButtonStyle.frosted, ButtonSize.md)}
        {renderButton(color, ButtonStyle.link, ButtonSize.md)}
      </div>
      <div className="tw-mb-4 tw-space-x-4">
        {renderButton(color, ButtonStyle.normal, ButtonSize.sm)}
        {renderButton(color, ButtonStyle.inverted, ButtonSize.sm)}
        {renderButton(color, ButtonStyle.transparent, ButtonSize.sm)}
        {renderButton(color, ButtonStyle.frosted, ButtonSize.sm)}
        {renderButton(color, ButtonStyle.link, ButtonSize.sm)}
      </div>
    </>
  );
};

export const Primary: React.FC<{}> = bindRenderVariations(ButtonColor.primary);

export const Secondary: React.FC<{}> = bindRenderVariations(
  ButtonColor.secondary,
);

export const TradeLong: React.FC<{}> = bindRenderVariations(
  ButtonColor.tradeLong,
);

export const TradeShort: React.FC<{}> = bindRenderVariations(
  ButtonColor.tradeShort,
);

export const Success: React.FC<{}> = bindRenderVariations(ButtonColor.success);

export const Warning: React.FC<{}> = bindRenderVariations(ButtonColor.warning);
