import React, { useContext } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositContext } from '../../../contexts/deposit-context';
import { validateSignatures } from '../../../../../../utils/signature/signatureValidation';
import { useAccount } from 'app/hooks/useAccount';
import { WalletContext } from '@sovryn/react-wallet';
import { getContract } from '../../../../../../utils/blockchain/contract-helpers';
import { FastBtcButton } from '../../FastBtcButton';
import { StatusComponent } from 'app/components/Dialogs/TxDialog';
import { TxStatus } from 'store/global/transactions-store/types';
import styles from './index.module.scss';
import { InputField } from 'app/components/InputField';

const multisigAddress = getContract('fastBtcMultisig').address;

interface ISignatureValidationProps {
  onClick: () => void;
}

export const SignatureValidation: React.FC<ISignatureValidationProps> = ({
  onClick,
}) => {
  const { address, signatures } = useContext(DepositContext);
  const { t } = useTranslation();
  const account = useAccount();
  const { chainId } = useContext(WalletContext);

  const [isSignatureValid, setIsSignatureValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageStatus, setPageStatus] = useState(TxStatus.PENDING);
  const [statusText, setStatusText] = useState(
    t(translations.fastBtcPage.deposit.validationScreen.validationTextLoading),
  );

  var downloadData =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(
      JSON.stringify({
        signatures: signatures,
      }),
    );

  validateSignatures(
    signatures,
    address,
    account,
    chainId,
    multisigAddress,
  ).then(valid => {
    setIsSignatureValid(valid);
    setLoading(false);
    setPageStatus(valid ? TxStatus.CONFIRMED : TxStatus.FAILED);
    setStatusText(
      valid
        ? t(
            translations.fastBtcPage.deposit.validationScreen
              .validationTextSuccess,
          )
        : t(
            translations.fastBtcPage.deposit.validationScreen
              .validationTextError,
          ),
    );
  });

  return (
    <>
      <div className={styles.title}>
        {t(translations.fastBtcPage.deposit.validationScreen.title)}
      </div>
      <div className="tw-mb-11 tw-text-gray-8 tw-text-center">
        {t(translations.fastBtcPage.deposit.validationScreen.description)}
      </div>
      <div className="tw-full">
        <StatusComponent status={pageStatus} onlyImage={true} />
        <div className={styles.status}>{statusText}</div>
        <div className={styles.download}>
          <a
            className={styles.linkText}
            href={downloadData}
            download="verification_details.json"
          >
            Click to download verification details
          </a>
        </div>
        <FastBtcButton
          text={t(translations.fastBtcPage.deposit.validationScreen.cta)}
          disabled={!isSignatureValid || loading}
          loading={loading}
          onClick={onClick}
        />
      </div>
    </>
  );
};
