import styled from 'styled-components';

interface IPoolAssetProps {
  assetColor: string;
}

export const PoolAsset = styled.div<IPoolAssetProps>`
  display: flex;
  font-size: 0.75rem;
  line-height: 1.375;

  &:before {
    display: inline-block;
    content: '';
    width: 1rem;
    height: 1rem;
    background-color: ${props => props.assetColor};
    border-radius: 50%;
    margin-right: 0.6875rem;
  }
`;
