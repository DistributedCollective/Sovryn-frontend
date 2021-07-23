import React from 'react';
import imgRbtc from 'assets/images/promoCards/RBTC_Card.png';
import imgSov from 'assets/images/promoCards/SOV_Card.png';
import imgDoc from 'assets/images/promoCards/DoC_Card.png';
import imgSectionMargin from 'assets/images/promoCards/Margin_Icon.png';
import imgSectionLend from 'assets/images/promoCards/Lending_Icon.png';
import imgSectionBorrow from 'assets/images/promoCards/Borrowing_Icon.png';
import imgSectionYield from 'assets/images/promoCards/Yield_Icon.png';
import { Asset } from 'types';
import { AppSection, ISectionData } from './types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

export const getSectionData = (section: AppSection): ISectionData => {
  switch (section) {
    case AppSection.Lend:
      return {
        imageUrl: imgSectionLend,
        title: (
          <Trans
            i18nKey={translations.landingPage.promotions.sections.lending}
          />
        ),
      };
    case AppSection.Borrow:
      return {
        imageUrl: imgSectionBorrow,
        title: (
          <Trans
            i18nKey={translations.landingPage.promotions.sections.borrowing}
          />
        ),
      };
    case AppSection.MarginTrade:
      return {
        imageUrl: imgSectionMargin,
        title: (
          <Trans
            i18nKey={translations.landingPage.promotions.sections.marginTrading}
          />
        ),
      };
    case AppSection.YieldFarm:
      return {
        imageUrl: imgSectionYield,
        title: (
          <Trans
            i18nKey={translations.landingPage.promotions.sections.yieldFarming}
          />
        ),
      };

    default:
      return {
        imageUrl: imgSectionLend,
        title: (
          <Trans
            i18nKey={translations.landingPage.promotions.sections.lending}
          />
        ),
      };
  }
};

export const getBackgroundImageUrl = (asset: Asset): string => {
  switch (asset) {
    case Asset.RBTC:
      return imgRbtc;
    case Asset.DOC:
      return imgDoc;
    case Asset.SOV:
      return imgSov;
    default:
      return imgRbtc;
  }
};
