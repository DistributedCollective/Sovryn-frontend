import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import { H1, H2, H3, H4, H5, H6, Label as LabelHeading } from './index';

export default {
  title: 'Atoms/Headings',
  component: H1,
};

const TemplateH1: Story<ComponentProps<typeof H1>> = args => <H1 {...args} />;
export const Heading1 = TemplateH1.bind({});
Heading1.args = {
  children: 'Heading 1',
};

const TemplateH2: Story<ComponentProps<typeof H2>> = args => <H2 {...args} />;
export const Heading2 = TemplateH2.bind({});
Heading2.args = {
  children: 'Heading 2',
};

const TemplateH3: Story<ComponentProps<typeof H3>> = args => <H3 {...args} />;
export const Heading3 = TemplateH3.bind({});
Heading3.args = {
  children: 'Heading 3',
};

const TemplateH4: Story<ComponentProps<typeof H4>> = args => <H4 {...args} />;
export const Heading4 = TemplateH4.bind({});
Heading4.args = {
  children: 'Heading 4',
};

const TemplateH5: Story<ComponentProps<typeof H5>> = args => <H5 {...args} />;
export const Heading5 = TemplateH5.bind({});
Heading5.args = {
  children: 'Heading 5',
};

const TemplateH6: Story<ComponentProps<typeof H6>> = args => <H6 {...args} />;
export const Heading6 = TemplateH6.bind({});
Heading6.args = {
  children: 'Heading 6',
};

const TemplateLabel: Story<ComponentProps<typeof LabelHeading>> = args => (
  <LabelHeading {...args} />
);
export const Label = TemplateLabel.bind({});
Label.args = {
  children: 'Label',
};
