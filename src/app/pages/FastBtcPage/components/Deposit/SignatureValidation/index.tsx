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
import { TxStatus } from 'store/global/transactions-store/types';
import styles from './index.module.scss';
import { StatusComponent } from 'app/components/Dialogs/StatusComponent';
import { FastBtcDirectionType } from 'app/pages/FastBtcPage/types';

const multisigAddress = getContract('fastBtcMultisig').address;

interface ISignatureValidationProps {
  onClick: () => void;
  type: FastBtcDirectionType;
}

export const SignatureValidation: React.FC<ISignatureValidationProps> = ({
  onClick,
  type,
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
      <div className="tw-mb-5 tw-text-gray-8 tw-text-center">
        {t(translations.fastBtcPage.deposit.validationScreen.description)}
      </div>
      <div className="tw-w-full tw-mb-12">
        <StatusComponent status={pageStatus} showLabel={false} />
        <div className={styles.status}>{statusText}</div>
        <div className={styles.download}>
          <a
            className={styles.linkText}
            href={downloadData}
            download="verification_details.json"
          >
            {t(translations.fastBtcPage.deposit.validationScreen.download)}
          </a>
        </div>
        <FastBtcButton
          className="tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
          text={t(
            type === FastBtcDirectionType.TRANSAK
              ? translations.fastBtcPage.transak.validationScreen.cta
              : translations.fastBtcPage.deposit.validationScreen.cta,
          )}
          disabled={!isSignatureValid || loading}
          loading={loading}
          onClick={onClick}
        />
      </div>
    </>
  );
};
