/**
 *
 * BridgePage
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectBridgePage } from './selectors';
import { bridgePageSaga } from './saga';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Logo } from './components/Logo';
import { Card } from 'form/Card';
import RadioGroup from 'form/RadioGroup';

import ethIcon from './assets/eth.svg';
import rskIcon from './assets/rsk.svg';
import { FormGroup } from 'form/FormGroup';
import { AssetSelect } from 'form/AssetSelect';
import { Asset } from '../../../types/asset';
import { Chain } from '../../../types/chain';

interface Props {}

export function BridgePage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgePageSaga });

  const bridgePage = useSelector(selectBridgePage);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [chain, setChain] = useState(Chain.RSK.toString());
  const [asset, setAsset] = useState(Asset.USDT);

  return (
    <div>
      <Helmet>
        <title>{t(translations.salesPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.salesPage.meta.description)}
        />
      </Helmet>
      <Header />
      <main className="tw-container tw-mt-12">
        <Logo />

        <div className="tw-w-full tw-flex tw-flex-col tw-space-y-8 lg:tw-flex-row lg:tw-justify-between lg:tw-items-start lg:tw-space-y-0 lg:tw-space-x-8">
          <div className="tw-w-full tw-w-1/3">
            <Card>
              Starting Chain
              <FormGroup>
                <RadioGroup value={chain} onChange={e => setChain(e)}>
                  <RadioGroup.Button
                    value={Chain.ETHEREUM.toString()}
                    text={
                      <>
                        <img
                          src={ethIcon}
                          alt="Ethereum"
                          className="tw-mr-1 tw-w-4"
                        />{' '}
                        <div className="tw-truncate">ETHEREUM</div>
                      </>
                    }
                  />
                  <RadioGroup.Button
                    value={Chain.RSK.toString()}
                    text={
                      <>
                        <img
                          src={rskIcon}
                          alt="RSK"
                          className="tw-mr-1 tw-w-4"
                        />{' '}
                        <div className="tw-truncate">RSK</div>
                      </>
                    }
                  />
                </RadioGroup>
              </FormGroup>
              <FormGroup label={t(translations.bridgePage.fields.sendAsset)}>
                <AssetSelect
                  value={asset}
                  onChange={value => setAsset(value)}
                  placeholder={t(
                    translations.bridgePage.fields.sendAssetPlaceholder,
                  )}
                  options={[Asset.USDT, Asset.BTC, Asset.CSOV]}
                />
              </FormGroup>
            </Card>
          </div>
          <div className="tw-w-full tw-w-1/3">Connect to wallet.</div>
          <div className="tw-w-full tw-w-1/3">
            <Card>Destination Chain</Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
