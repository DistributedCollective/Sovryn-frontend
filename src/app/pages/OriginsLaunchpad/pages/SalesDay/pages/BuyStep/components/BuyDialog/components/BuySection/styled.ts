import styled, { css } from 'styled-components';
import slipImage from 'assets/images/settings-white.svg';

export const BuyWrapper = styled.div`
  width: 66%;
  height: 100%;
  border-radius: 1.25rem;
  background-color: #181818;
  box-shadow: -11px 0px 25px #00000026;
  padding: 4.75rem 2rem;
`;

export const SlippageButton = styled.button`
  border: 0;
  width: 18px;
  height: 18px;
  background: transparent url(${slipImage}) center center no-repeat;
  background-size: 18px 18px;
`;

interface IBuyButtonProps {
  disabled?: boolean;
}

export const BuyButton = styled.button<IBuyButtonProps>`
  height: 3.75rem;
  width: 100%;
  margin-top: 4.3125rem;
  border: 1px solid #17c3b2;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 800;
  background: #17c3b2;
  border-radius: 0.625rem;
  transition: opacity 0.3s;
  text-transform: uppercase;
  padding: initial;

  &:hover {
    opacity: 75%;
  }

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`;
