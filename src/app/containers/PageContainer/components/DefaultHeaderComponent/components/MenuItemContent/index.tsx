import React from 'react';

type MenuItemContentProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

export const MenuItemContent: React.FC<MenuItemContentProps> = ({
  title,
  content,
  icon,
}) => {
  return (
    <>
      <div className="tw-text-sm tw-font-medium tw-leading-none tw-mb-2 tw-text-sov-white tw-flex tw-items-center">
        {icon && <div className="tw-mr-2">{icon}</div>}
        {title}
      </div>
      <div className="tw-text-tiny tw-font-medium tw-leading-none tw-text-gray-8">
        {content}
      </div>
    </>
  );
};
