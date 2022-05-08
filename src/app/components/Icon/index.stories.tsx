import React, { ComponentProps, useMemo } from 'react';
import { Story } from '@storybook/react';
import { Icon } from './index';
import * as IconNames from './iconNames';
import { IconName } from './types';
import { faBacterium } from '@fortawesome/free-solid-svg-icons';

export default {
  title: 'Atoms/Icon',
  component: Icon,
};

const Template: Story<ComponentProps<typeof Icon>> = args => {
  return <Icon {...args} />;
};

const CustomIconTemplate: Story<ComponentProps<typeof Icon>> = args => {
  const customIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M4 7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm15 11.69l-5-2.5v-3.63c-.32.11-.66.22-1 .29v3.32l-6 2.57v-7.25c-.36-.27-.69-.57-1-.9v8.1l-5-2.5V10c.55 0 1-.45 1-1s-.45-1-1-1V1.31l3.43 1.71c.11-.31.24-.62.39-.92L.72.05A.545.545 0 00.5 0C.22 0 0 .22 0 .5v16c0 .2.12.36.28.44l6 3c.07.04.14.06.22.06.07 0 .14-.01.2-.04l6.79-2.91 5.79 2.9c.07.03.14.05.22.05.28 0 .5-.22.5-.5v-4.21c-.31.13-.64.21-1 .21v3.19zM10 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6.72-.94l-1.43-.72c.2.43.36.89.48 1.36l.23.11V5.5c-.55 0-1 .45-1 1s.45 1 1 1v1.96l1 1V3.5c0-.2-.12-.36-.28-.44zm-3.69 5.56c.14-.21.27-.42.38-.65.02-.04.04-.07.05-.11.11-.22.2-.45.28-.69v-.01c.07-.24.13-.48.17-.73l.03-.17c.04-.25.06-.5.06-.76C17 2.46 14.54 0 11.5 0S6 2.46 6 5.5 8.46 11 11.5 11c.26 0 .51-.02.76-.06l.17-.03c.25-.04.49-.1.73-.17h.01c.24-.08.47-.17.69-.28.04-.02.07-.03.11-.05.23-.11.44-.24.65-.38l.18.18 3.5 3.5c.17.18.42.29.7.29a1.003 1.003 0 00.71-1.71l-3.68-3.67zm-4.53.88c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        fillRule="evenodd"
      ></path>
    </svg>
  );

  return (
    <div className="tw-pt-4">
      <Icon {...args} icon={customIcon} />
      <span className="tw-text-lg">Custom Icon</span>
    </div>
  );
};

const FontAwesomeIconTemplate: Story<ComponentProps<typeof Icon>> = args => {
  return (
    <div className="tw-pt-4">
      <Icon {...args} />
      <span className="tw-text-lg">FontAwesome Icon</span>
    </div>
  );
};

const AllIconsTemplate: Story<ComponentProps<typeof Icon>> = () => {
  const icons = Object.values(IconNames);

  const allIcons = useMemo(() => {
    return icons.map((icon: IconName, key) => {
      return (
        <div
          key={key}
          className="tw-flex tw-items-center tw-cursor-pointer tw-text-black tw-flex-col tw-p-6 tw-bg-sov-white tw-rounded-md hover:tw-bg-primary hover:tw-text-secondary"
          onClick={() => navigator.clipboard.writeText(icon)}
        >
          <Icon key={key} size={30} icon={icon} />
          <span className="tw-text-center tw-py-3">{icon}</span>
        </div>
      );
    });
  }, [icons]);

  return (
    <>
      <h2 className="tw-my-4 tw-text-center">Click on [icon] to copy name</h2>
      <div className="tw-grid tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
        {allIcons}
      </div>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  icon: IconNames.WARNING,
  size: 30,
  className: 'tw-text-warning',
};

export const FontAwesomeIcon = FontAwesomeIconTemplate.bind({});
FontAwesomeIcon.args = {
  icon: faBacterium,
  size: '3x',
  className: 'tw-text-success tw-mr-2',
};

export const CustomIcon = CustomIconTemplate.bind({});
CustomIcon.args = {
  size: 30,
  className: 'tw-text-yellow-1 tw-mr-2',
};
export const AllIcons = AllIconsTemplate.bind({});
