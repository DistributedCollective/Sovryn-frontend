import styled from 'styled-components';

export const DialogWrapper = styled.div`
  background-color: #181818;
  padding: 2.5rem 8.75rem 3.75rem 8.75rem;
  border-radius: 1.25rem;
  margin-left: 2.5rem;
  width: 77.1875rem;
`;

export const DialogTitle = styled.div`
  font-size: 1.75rem;
  letter-spacing: 0;
  margin-bottom: 5rem;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-size: 0.875rem;
  line-height: 1.0625rem;
  letter-spacing: 0;
  font-weight: 100;
  margin-bottom: 1rem;

  &:before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #ededed;
    content: '';
    margin-right: 0.625rem;
    display: block;
    position: absolute;
    left: -1rem;
    top: 0.25rem;
  }
`;
