import styled, { css } from 'styled-components/macro';

interface Wrapper {
  invalid?: boolean;
  isLight?: boolean;
}

export const StyledWrapper = styled.label.attrs(_ => ({
  className: 'd-flex flex-row w-100 px-2 py-1 m-0',
}))`
  height: 40px;
  transition: 0.3s border-color;
  will-change: border-color;
  position: relative;
  border: 1px solid #575757;
  border-radius: 8px;
  ${(props: Wrapper) =>
    props.invalid &&
    css`
      border-color: var(--danger) !important;
    `}
  ${(props: Wrapper) =>
    props.isLight &&
    css`
      background: #e9eae9 !important;
      color: var(--black);
    `};
`;

export const StyledInput = styled.input`
  background-color: transparent;
  width: 100%;
  color: var(--white);
  font-size: 16px;
  letter-spacing: 0;
  text-align: center;
  ${(props: Wrapper) =>
    props.isLight &&
    css`
      background: #e9eae9 !important;
      color: var(--black);
    `};
`;

export const RightElement = styled.div`
  position: absolute;
  right: 21px;
  display: flex;
  align-items: center;
  height: 30px;
  color: #e9eae9;
  color: ${(props: Wrapper) => (props.isLight ? '#000000' : '#e9eae9')};
`;
