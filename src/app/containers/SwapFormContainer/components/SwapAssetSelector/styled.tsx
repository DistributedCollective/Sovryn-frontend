import styled from 'styled-components/macro';

export const StyledButton = styled.button.attrs(attrs => ({
  className:
    'w-100 d-flex flex-row justify-content-between align-items-center p-0',
}))`
  position: relative;
  height: 40px;
  background-color: #222222;
  border: 1px solid #575757;
  border-radius: 8px;
  color: #e9eae9;
  font-family: Montserrat-SemiBold;
  font-size: 16px;
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
