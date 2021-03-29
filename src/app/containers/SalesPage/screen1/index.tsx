import React from 'react';
import styled from 'styled-components/macro';
import SalesButton from 'app/components/SalesButton';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';

const StyledContent = styled.div`
  height: 620px;
  background: var(--sales-background);
  max-width: 1235px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  .content-header {
    font-size: 28px;
    text-align: center;
  }
  button {
    margin: 0 auto;
  }
  a {
    margin-top: 110px;
    color: var(--gold);
    font-weight: normal;
  }
`;

export default function Screen1() {
  const { t } = useTranslation();
  const { connect } = useWalletContext();

  return (
    <StyledContent>
      <p className="content-header">
        Engage your wallet to participate in the
        <br />
        SOV* Genesis Pre-Order
      </p>
      <SalesButton
        text={t(translations.wallet.connect_btn)}
        onClick={() => connect()}
      />
    </StyledContent>
  );
}
