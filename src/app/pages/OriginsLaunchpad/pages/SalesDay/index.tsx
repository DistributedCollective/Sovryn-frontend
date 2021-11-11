import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import imgTitle from 'assets/images/OriginsLaunchpad/MyntSale/token.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { EngageWalletStep } from './pages/EngageWalletStep/index';
import { AccessCodeVerificationStep } from './pages/AccessCodeVerificationStep/index';
import { useIsConnected } from 'app/hooks/useAccount';
import { ImportantInformationStep } from './pages/ImportantInformationStep';
import { BuyStep } from './pages/BuyStep';
import { useGetSaleInformation } from '../../hooks/useGetSaleInformation';
import saleStorage from './storage';
import styles from './index.module.scss';

interface ISalesDayProps {
  saleName: string;
}

export const SalesDay: React.FC<ISalesDayProps> = ({ saleName }) => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const connected = useIsConnected();
  const info = useGetSaleInformation();

  const setStep = (step: number) => {
    saleStorage.saveData({ step });
    history.push(`${url}/${step}`);
  };

  useEffect(() => {
    const { step } = saleStorage.getData();
    if (connected) {
      history.push(`${url}/${step}`);
    } else {
      history.push(`${url}/engage-wallet`);
    }
  }, [connected, location.pathname, history, url]);

  return (
    <div className="tw-mb-52">
      <div className="tw-text-center tw-items-center tw-justify-center tw-flex tw-mb-12">
        <img
          className={styles.titleImage}
          src={imgTitle}
          alt="Origins Sales Day"
        />
        <div className="tw-text-4xl tw-font-semibold tw-leading-none tw-tracking-normal tw-ml-8 tw-uppercase">
          {t(translations.originsLaunchpad.saleDay.title, { token: saleName })}
        </div>
      </div>
      <div className="tw-justify-center tw-flex tw-text-center">
        <Switch>
          <Route
            exact
            path={`${url}/engage-wallet`}
            component={EngageWalletStep}
          />
          <Route exact path={`${url}/1`}>
            <AccessCodeVerificationStep
              saleName={saleName}
              onVerified={() => setStep(2)}
              info={info}
            />
          </Route>
          <Route exact path={`${url}/2`}>
            <ImportantInformationStep
              saleName={saleName}
              onSubmit={() => setStep(3)}
            />
          </Route>
          <Route exact path={`${url}/3`}>
            <BuyStep saleInformation={info} saleName={saleName} />
          </Route>
          <Redirect to={`${url}/engage-wallet`} />
        </Switch>
      </div>
    </div>
  );
};
