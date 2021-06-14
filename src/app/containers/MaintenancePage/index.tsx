/**
 *
 * MaintenancePage
 *
 */
import React from 'react';

import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { media } from '../../../styles/media';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  message: string;
}

export function MaintenancePage(props: Props) {
  const { t } = useTranslation();
  return (
    <div
      className="align-items-center d-flex justify-content-center"
      style={{ height: '100vh', marginTop: '-4.4rem' }}
    >
      <div className="text-center">
        <StyledLogo src={logoSvg} className="tw-mx-auto tw-mb-4" />
        <div className="font-size-lg">
          {props.message || t(translations.maintenance.full)}
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
