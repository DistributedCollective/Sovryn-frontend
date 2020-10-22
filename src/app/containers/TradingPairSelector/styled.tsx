import styled from 'styled-components';

export const StyledAssetLogo = styled.img.attrs(attrs => ({
  alt: 'Asset type',
  className: 'mr-3',
}))`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;
