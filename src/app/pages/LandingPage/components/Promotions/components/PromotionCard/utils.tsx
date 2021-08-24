import React from 'react';
import imgOrangeBg from 'assets/images/promoCards/Orange.svg';
import imgBlueBg from 'assets/images/promoCards/Blue.svg';
import imgDarkYellowBg from 'assets/images/promoCards/DarkYellow.svg';
import imgLightGreenBg from 'assets/images/promoCards/LightGreen.svg';
import imgYellowBg from 'assets/images/promoCards/Yellow.svg';
import imgDarkBlueBg from 'assets/images/promoCards/DarkBlue.svg';
import imgGreenBg from 'assets/images/promoCards/Green.svg';
import imgGreyBg from 'assets/images/promoCards/Grey.svg';
import imgPinkBg from 'assets/images/promoCards/Pink.svg';
import imgPurpleBg from 'assets/images/promoCards/Purple.svg';
import imgTurquoiseBg from 'assets/images/promoCards/Turquoise.svg';
import { AppSection, PromotionColor } from './types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

export const getSectionTitle = (section: AppSection): JSX.Element => {
  switch (section) {
    case AppSection.Lend:
      return (
        <Trans i18nKey={translations.landingPage.promotions.sections.lending} />
      );

    case AppSection.Borrow:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.borrowing}
        />
      );

    case AppSection.MarginTrade:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.marginTrading}
        />
      );

    case AppSection.YieldFarm:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.yieldFarming}
        />
      );

    case AppSection.Spot:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.spotTrading}
        />
      );

    default:
      return (
        <Trans i18nKey={translations.landingPage.promotions.sections.swap} />
      );
  }
};

export const getBackgroundImageUrl = (color: PromotionColor): string => {
  switch (color) {
    case PromotionColor.Orange:
      return imgOrangeBg;
    case PromotionColor.Blue:
      return imgBlueBg;
    case PromotionColor.DarkYellow:
      return imgDarkYellowBg;
    case PromotionColor.LightGreen:
      return imgLightGreenBg;
    case PromotionColor.Yellow:
      return imgYellowBg;
    case PromotionColor.DarkBlue:
      return imgDarkBlueBg;
    case PromotionColor.Green:
      return imgGreenBg;
    case PromotionColor.Grey:
      return imgGreyBg;
    case PromotionColor.Pink:
      return imgPinkBg;
    case PromotionColor.Purple:
      return imgPurpleBg;
    case PromotionColor.Turquoise:
      return imgTurquoiseBg;
    default:
      return imgOrangeBg;
  }
};

export const getLinkPathname = (section: AppSection): string => {
  switch (section) {
    case AppSection.Borrow:
      return 'borrow';
    case AppSection.Lend:
      return 'lend';
    case AppSection.MarginTrade:
      return 'trade';
    case AppSection.YieldFarm:
      return 'yield-farm';
    case AppSection.Spot:
      return 'spot';
    default:
      return 'swap';
  }
};
