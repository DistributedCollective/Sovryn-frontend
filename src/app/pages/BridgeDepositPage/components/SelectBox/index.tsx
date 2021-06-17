import React from 'react';
import styled from 'styled-components/macro';
import cn from 'classnames';

type Props = {
  onClick?: Function;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};
export function SelectBox({ onClick, disabled, children, className }: Props) {
  return (
    <Item
      onClick={() => {
        if (!disabled && onClick) onClick();
      }}
      className={cn(
        'tw-py-4 tw-text-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer tw-transition tw-duration-700 tw-ease-in-out',
        { 'tw-opacity-25': disabled },
        className,
      )}
      disabled={disabled}
    >
      {children}
    </Item>
  );
}

type ItemProps = {
  disabled?: boolean;
};
export const Item = styled.div`
  width: 160px;
  height: 160px;
  border: 1px solid #e9eae9;
  border-radius: 20px;
  &:hover {
    background: ${(props: ItemProps) =>
      !props.disabled ? '#575757 0% 0% no-repeat padding-box' : ''};
    border: ${(props: ItemProps) =>
      !props.disabled ? '5px solid #e9eae9' : ''};
  }
`;
