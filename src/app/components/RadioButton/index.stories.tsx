import React, { ComponentProps, useCallback, useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { RadioButton } from './index';
import { RadioButtonColor, RadioButtonSize, RadioButtonStyle } from './types';

export default {
  title: 'Atoms/RadioButton',
  component: RadioButton,
} as Meta;

const Template: Story<ComponentProps<typeof RadioButton>> = args => (
  <RadioButton {...args} />
);

const DiffColorsTemplate: Story<ComponentProps<typeof RadioButton>> = args => {
  const [isSelected, setIsSelected] = useState('long');
  const onChange = useCallback(value => setIsSelected(value), [setIsSelected]);
  return (
    <RadioButton
      {...args}
      selected={isSelected}
      onChange={value => onChange(value)}
    />
  );
};

const OneButtonDisabledTemplate: Story<ComponentProps<
  typeof RadioButton
>> = args => {
  const [isSelected, setIsSelected] = useState('long');
  const onChange = useCallback(value => setIsSelected(value), [setIsSelected]);
  return (
    <RadioButton
      {...args}
      selected={isSelected}
      onChange={value => onChange(value)}
    />
  );
};

const FullWidthTemplate: Story<ComponentProps<typeof RadioButton>> = args => {
  const [isSelected, setIsSelected] = useState('50');
  const onChange = useCallback(value => setIsSelected(value), [setIsSelected]);
  return (
    <RadioButton
      {...args}
      selected={isSelected}
      onChange={value => onChange(value)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  color: RadioButtonColor.secondary,
  entries: [
    {
      value: 'sov',
      text: 'sov',
    },
    {
      value: 'doc',
      text: 'doc',
    },
  ],
};

export const DiffColors = DiffColorsTemplate.bind({});
DiffColors.args = {
  entries: [
    {
      value: 'long',
      text: 'long',
      color: RadioButtonColor.tradeLong,
    },
    {
      value: 'short',
      text: 'short',
      color: RadioButtonColor.tradeShort,
    },
  ],
};

export const OneButtonDisabled = OneButtonDisabledTemplate.bind({});
OneButtonDisabled.args = {
  entries: [
    {
      value: 'long',
      text: 'long',
      color: RadioButtonColor.tradeLong,
    },
    {
      value: 'short',
      text: 'short',
      color: RadioButtonColor.tradeShort,
      disabled: true,
    },
  ],
};

export const FullWidth = FullWidthTemplate.bind({});
FullWidth.args = {
  size: RadioButtonSize.md,
  style: RadioButtonStyle.transparent,
  merged: true,
  fullWidth: true,
  entries: [
    {
      value: '10',
      text: '10%',
    },
    {
      value: '25',
      text: '25%',
    },
    {
      value: '50',
      text: '50%',
    },
    {
      value: '75',
      text: '75%',
    },
    {
      value: '100',
      text: 'max',
    },
  ],
};
