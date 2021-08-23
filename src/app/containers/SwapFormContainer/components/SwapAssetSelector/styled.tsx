import styled from 'styled-components/macro';

export const StyledButton = styled.button.attrs(attrs => ({
  className:
    'tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center tw-p-0',
}))`
  position: relative;
  height: 40px;
  background-color: #222222;
  border: 1px solid #575757;
  border-radius: 0.5rem;
  color: #e8e8e8;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
`;

export const CaretElement = styled.div`
  position: absolute;
  right: 21px;
  display: flex;
  align-items: center;
  height: 13px;
  width: 22px;
`;
