import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function DescriptionBlock() {
  const { t } = useTranslation();
  return (
    <Container className="font-family-montserrat">
      <h1 className="tw-capitalize">
        {t(translations.escrowPage.description.title)}
      </h1>
      <p>{t(translations.escrowPage.description.line1)}</p>
      <p>{t(translations.escrowPage.description.line2)}</p>
      <p>{t(translations.escrowPage.description.line3)}</p>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 50px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  h1 {
    margin-bottom: 15px;
    font-size: 28px;
  }
  p {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;
