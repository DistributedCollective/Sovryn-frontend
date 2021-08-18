import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../../styles/media';
import { OriginClaimDialog } from './OriginClaimDialog';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { useAccount } from '../../../hooks/useAccount';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../locales/i18n';

export function OriginClaimBanner() {
  const { t } = useTranslation();
  const { value } = useCacheCallWithValue<string>(
    'OriginInvestorsClaim',
    'investorsAmountsList',
    '0',
    useAccount(),
  );
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {Number(value) !== 0 && (
        <Div>
          <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
            <div>{t(translations.claimOriginBanner.text)}</div>
            <div>
              <Button onClick={() => setOpen(open => !open)}>
                {t(translations.claimOriginBanner.cta)}
              </Button>
            </div>
          </div>
        </Div>
      )}
      <OriginClaimDialog isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}

const Div = styled.div`
  background-color: rgba(254, 192, 4, 0.25);
  padding: 31px;
  font-weight: 500;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  line-height: 1;
  font-size: 16px;
  ${media.lg`
    padding-left: 100px;
    padding-right: 100px;
    font-size: 24px;
  `}
`;

const Button = styled.button.attrs(_ => ({
  className: 'tw-bg-primary',
}))`
  margin-left: 25px;
  border: 0;
  border-radius: 10px;
  white-space: nowrap;
  color: #000;
  font-size: 20px;
  font-family: 900;
  padding: 13px 24px;
  line-height: 1;
  transition: opacity 300ms;
  &:hover {
    opacity: 0.75;
  }
`;
