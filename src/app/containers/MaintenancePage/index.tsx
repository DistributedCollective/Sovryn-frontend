/**
 *
 * MaintenancePage
 *
 */

import React from 'react';
import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { media } from '../../../styles/media';
import styled from 'styled-components/macro';

interface Props {
  message: string;
}

export function MaintenancePage(props: Props) {
  return (
    <div
      className="align-items-center d-flex justify-content-center"
      style={{ height: '100vh' }}
    >
      <div className="text-center">
        <StyledLogo src={logoSvg} />
        <div className="font-size-lg">
          {props.message ||
            'Sovryn is under maintenance, please try again later'}
        </div>
      </div>
    </div>
  );
}

const StyledLogo = styled.img.attrs(_ => ({
  alt: '',
}))`
  width: 345px;
  height: 75px;
  margin: 0 0 0 1rem;
  ${media.xl`
    width: 426px;
    height: 72px;
    margin: 0;
  `}
`;
