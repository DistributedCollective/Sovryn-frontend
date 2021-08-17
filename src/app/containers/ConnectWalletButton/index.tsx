import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as blockies from 'blockies-ts';
import { Button } from '@blueprintjs/core';
import { prettyTx } from '../../../utils/helpers';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import { Nullable } from 'types';

export function ConnectWalletButton() {
  const { connected, address, connect, disconnect } = useWalletContext();

  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState<Nullable<string>>(null);

  useEffect(() => {
    if (address) {
      setImgSrc(
        blockies
          .create({
            seed: address.toLowerCase(),
            size: 6,
          })
          .toDataURL(),
      );
    }
  }, [address]);

  return (
    <div className="tw-flex tw-flex-row tw-justify-end tw-mb-4">
      <div>
        {connected && (
          <div className="tw-flex tw-flex-row tw-justify-start tw-items-center">
            {imgSrc && <img src={imgSrc} alt={address} className="tw-mr-4" />}
            <div className="tw-flex tw-flex-row tw-justify-between">
              <strong>{prettyTx(address)}</strong>
              <Button
                small
                minimal
                className="tw-ml-4 tw-text-white"
                icon="log-out"
                title={t(translations.wallet.disconnect)}
                onClick={() => disconnect()}
              />
            </div>
          </div>
        )}
        {!connected && (
          <Button
            type="button"
            text={t(translations.wallet.btn)}
            icon="log-in"
            onClick={() => connect()}
          />
        )}
      </div>
    </div>
  );
}
