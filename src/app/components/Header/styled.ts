import styled from 'styled-components/macro';
import { ReactComponent as SovLogo } from '../../../assets/images/sovryn-logo-alpha.svg';
import { media } from '../../../styles/media';

type StyledProps = {
  open: boolean;
};

export const StyledMenu = styled.nav<StyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: black;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  height: 100%;
  text-align: left;
  padding: 4rem 2rem 2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 9;
  width: 100%;
  li {
    list-style-type: none;
  }
  a {
    font-size: 1.25rem;
    padding: 1.5rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: white;
    text-decoration: none;
    transition: color 0.3s linear;
    text-align: center;
  }
`;

export const StyledBurger = styled.button<StyledProps>`
  position: absolute;
  top: 1.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: white;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }
    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }
    :nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

export const StyledLogo = styled(SovLogo).attrs(_ => ({
  alt: '',
}))`
  width: 130px;
  height: 32px;
  margin: 0 0 0 1rem;

  // custom font for "Alpha" logo text
  #Alpha tspan {
    font-family: Orbitron-Medium, Orbitron;
  }

  ${media.xl`
    width: 216px;
    height: 53px;
    margin: 0;
  `}
`;
