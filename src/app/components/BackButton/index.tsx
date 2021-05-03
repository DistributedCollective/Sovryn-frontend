import * as React from 'react';
import styled from 'styled-components/macro';

interface Props {
  onClick: () => void;
}

export function BackButton(props: Props) {
  return <Button onClick={props.onClick} />;
}

const Button = styled.button.attrs(() => ({
  type: 'button',
}))`
  position: absolute;
  left: 24px;
  top: 24px;
  width: 24px;
  height: 24px;
  transition: opacity 0.5s;
  will-change: opacity;
  background: transparent
    url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMCwwSDI0VjI0SDBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTExLjY3LDMuODcsOS45LDIuMSwwLDEybDkuOSw5LjksMS43Ny0xLjc3TDMuNTQsMTJaIiBmaWxsPSIjZTllYWU5Ii8+PC9zdmc+')
    center center no-repeat;
  border: 0;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
