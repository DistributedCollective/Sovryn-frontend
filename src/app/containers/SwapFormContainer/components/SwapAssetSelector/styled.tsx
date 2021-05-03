import styled from 'styled-components/macro';

export const StyledButton = styled.button.attrs(attrs => ({
  className:
    'w-100 bg-dark mb-4 d-flex flex-row justify-content-between align-items-center p-0',
}))`
  position: relative;
  height: 40px;
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
  height: 30px;
`;
