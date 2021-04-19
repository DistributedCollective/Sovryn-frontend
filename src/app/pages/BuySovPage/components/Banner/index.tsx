import React from 'react';
import styled from 'styled-components/macro';
import logo from 'assets/sov/banner.svg';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

interface Props {
  onClick: () => void;
}

export function Banner(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Image />
      <H1>{t(translations.buySovPage.banner.title)}</H1>
      <div className="text-center">
        <Button onClick={props.onClick}>
          {t(translations.buySovPage.banner.cta)}
        </Button>
      </div>
    </>
  );
}

const Image = styled.div`
  width: 451px;
  height: 438px;
  margin: 0 auto 106px;
  background: transparent url(${logo}) center center no-repeat;
  background-size: 451px 438px;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 640px) {
    width: 300px;
    height: 300px;
    max-width: 100%;
    margin: 0 auto 30px;
    background-size: 251px 438px;
  }
`;

const H1 = styled.h1`
  display: block;
  margin: 0 auto 70px;
  text-align: center;
  font-size: 56px;
  font-weight: 900;
  text-transform: none;
  line-height: 47px;
  @media (max-width: 640px) {
    font-size: 35px;
    line-height: 42px;
    margin: 0 auto 30px;
  }
`;

const Button = styled.button`
  max-width: 320px;
  width: 100%;
  height: 60px;
  padding: 15px;
  line-height: 1;
  background: #17c3b2;
  border: 1px solid #17c3b2;
  border-radius: 8px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  transition: opacity 0.3s;
  margin-bottom: 310px;
  &:hover {
    opacity: 75%;
  }
  @media (max-width: 1200px) {
    margin-bottom: 30px;
  }
`;
