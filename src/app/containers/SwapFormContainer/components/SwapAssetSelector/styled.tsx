import styled from 'styled-components/macro';

export const StyledButton = styled.button.attrs(attrs => ({
  className:
    'tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center tw-p-0',
}))`
  position: relative;
  height: 2rem;
  background-color: #2c2c2c;
  border-radius: 0.5rem;
  color: #e9eae9;
  font-size: 1rem;
`;

export const CaretElement = styled.div`
  position: absolute;
  right: 21px;
  display: flex;
  align-items: center;
  height: 13px;
  width: 22px;
`;
