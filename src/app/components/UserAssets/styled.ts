import styled, { css } from 'styled-components';

interface IBuyButtonProps {
  disabled?: boolean;
}

export const BuyButton = styled.button<IBuyButtonProps>`
  height: 3.125rem;
  width: 100%;
  color: #000000;
  font-size: 1.25rem;
  line-height: 1.25;
  font-weight: 700;
  background: var(--primary);
  border-radius: 0.5rem;
  transition: opacity 0.3s;
  text-transform: uppercase;
  padding: initial;
  letter-spacing: 0;
  &:hover {
    opacity: 75%;
  }
  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`;

export const Img = styled.img`
  width: 2rem;
  height: 2rem;
  margin: 1.5rem auto 0.5rem;
`;
