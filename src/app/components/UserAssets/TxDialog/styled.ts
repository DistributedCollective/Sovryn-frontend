import styled from 'styled-components';

export const CloseButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  border: 0;
  position: absolute;
  right: -30px;
  top: -30px;
  background: transparent
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='42' viewBox='0 0 42 42'%3E%3Cg transform='translate(2 2)' fill='none' stroke='%23707070' stroke-width='2'%3E%3Ccircle cx='19' cy='19' r='19' stroke='none'/%3E%3Ccircle cx='19' cy='19' r='20' fill='none'/%3E%3C/g%3E%3Cpath d='M25.333,7.048,23.285,5l-8.119,8.119L7.048,5,5,7.048l8.119,8.119L5,23.285l2.048,2.048,8.119-8.119,8.119,8.119,2.048-2.048-8.119-8.119Z' transform='translate(5.833 5.833)' fill='%23f4f4f4'/%3E%3Cpath d='M0,0H42V42H0Z' fill='none'/%3E%3C/svg%3E")
    center center no-repeat;
  background-size: 42px 42px;
  transition: opacity;
  will-change: opacity;
  &:hover {
    opacity: 0.8;
  }
`;

export const StatusImage = styled.img`
  width: 4.375rem;
`;

export const WLContainer = styled.div`
`;

export const TitleWrapper = styled.div`
  font-size: 1.75rem;
  line-height: 1.25;
  letter-spacing: 0;
  font-weight: 600;
  margin: 0 auto;
`;
