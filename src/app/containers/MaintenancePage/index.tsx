/**
 *
 * MaintenancePage
 *
 */
import React from 'react';

import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { media } from '../../../styles/media';
import styled from 'styled-components/macro';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { discordInvite } from 'utils/classifiers';

export function MaintenancePage(props) {
  return (
    <div
      className="tw-items-center tw-flex tw-justify-center"
      style={{ height: '100vh', marginTop: '-4.4rem' }}
    >
      <div className="tw-text-center">
        <StyledLogo src={logoSvg} className="tw-mx-auto tw-mb-4" />
        <div className="tw-text-lg">
          <Trans
            i18nKey={translations.maintenance.full}
            components={[
              <a href={discordInvite} target="_blank" rel="noreferrer noopener">
                x
              </a>,
            ]}
          />
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
