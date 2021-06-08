import styled from 'styled-components';

export const EngageButton = styled.button`
  border: 1px solid;
  white-space: nowrap;
  margin: 0 auto;
  width: auto;
  height: 3.125rem;
  padding: 0.875rem 3.25rem;
  font-weight: 100;
  color: #fec004;
  font-size: 1.125rem;
  letter-spacing: 0;
  text-transform: capitalize;
  transition: all 0.3s;
  border-radius: 0.625rem;
  &:hover {
    background: rgba(254, 192, 4, 0.25) !important;
  }
  &:active,
  &:focus {
    background: rgba(254, 192, 4, 0.5) !important;
  }
`;

export const EngageWalletDialogWrapper = styled.div`
  height: 37.25rem;
  background-color: #181818;
  padding: 3.125rem 8.25rem 4.75rem 8.25rem;
  border-radius: 1.25rem;
  margin-left: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const DialogTitle = styled.div`
  font-size: 1.75rem;
  letter-spacing: 0;
  margin-bottom: 10.375rem;
`;
