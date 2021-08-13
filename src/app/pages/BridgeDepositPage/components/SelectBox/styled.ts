import styled from 'styled-components/macro';

type ItemProps = {
  disabled?: boolean;
};

export const Item = styled.div`
  width: 160px;
  height: 160px;
  border: 1px solid #e9eae9;
  border-radius: 20px;
  &:hover {
    background: ${(props: ItemProps) =>
      !props.disabled ? '#575757 0% 0% no-repeat padding-box' : ''};
    border: ${(props: ItemProps) =>
      !props.disabled ? '5px solid #e9eae9' : ''};
  }
`;
