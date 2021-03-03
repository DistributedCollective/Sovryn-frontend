import styled from 'styled-components/macro';
import { media } from '../../../styles/media';

export const StyledAssetLogo = styled.img.attrs(attrs => ({
  alt: 'Asset type',
  className: 'tw-mr-3',
}))`
  width: 24px;
  height: 24px;
  object-fit: contain;
  ${media.lg`
  width: 48px;
  height: 48px;
  `}
`;
