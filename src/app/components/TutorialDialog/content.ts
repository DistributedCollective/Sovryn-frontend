import step2screen1 from 'assets/images/tutorial/step2screen1.svg';
import step3screen1 from 'assets/images/tutorial/step3screen1.svg';
import step4screen1 from 'assets/images/tutorial/step4screen1.svg';
import step5screen1 from 'assets/images/tutorial/step5screen1.svg';
import step6screen1 from 'assets/images/tutorial/step6screen1.svg';
import browserImg from 'assets/images/tutorial/browser.svg';

import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

export const content = {
  1: {
    leftImage: browserImg,
    speech: t(translations.rskConnectTutorial[1]),
    armPosition: 'mid-high',
  },
  2: {
    leftImage: step2screen1,
    speech: t(translations.rskConnectTutorial[2]),
    armPosition: 'high',
  },
  3: {
    leftImage: step3screen1,
    speech: t(translations.rskConnectTutorial[3]),
    armPosition: 'mid-low',
  },
  4: {
    leftImage: step4screen1,
    speech: t(translations.rskConnectTutorial[4]),
    armPosition: 'center',
  },
  5: {
    leftImage: step5screen1,
    speech: t(translations.rskConnectTutorial[5]),
    armPosition: 'low',
  },
  6: {
    leftImage: step6screen1,
    speech: t(translations.rskConnectTutorial[6]),
    armPosition: 'low',
  },
  7: {
    leftImage: step6screen1,
    speech: t(translations.rskConnectTutorial[7]),
    armPosition: 'low',
  },
};
