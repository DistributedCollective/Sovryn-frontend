import React, { useCallback } from 'react';
import { Classes, Overlay } from '@blueprintjs/core';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import { FieldGroup } from 'app/components/FieldGroup';
import { DummyField } from 'app/components/DummyField';
import { Button, ButtonSize, ButtonStyle } from 'app/components/Button';
import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Icon } from 'app/components/Icon';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { bitocracyUrl } from 'utils/classifiers';

const pricePerSov = 9736;
interface IOriginClaimDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginClaimDialog: React.FC<IOriginClaimDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const account = useAccount();

  const { value: sovAmount, loading } = useCacheCallWithValue<string>(
    'OriginInvestorsClaim',
    'investorsAmountsList',
    '0',
    account,
  );

  const btcAmount = bignumber(sovAmount).div(1e18).mul(pricePerSov).toString();

  const { send, ...tx } = useSendContractTx('OriginInvestorsClaim', 'claim');
  const handleSubmit = useCallback(() => {
    if (!tx.loading) {
      send([], { from: account }, { type: TxType.SOV_ORIGIN_CLAIM });
    }
  }, [account, send, tx]);

  const handleClose = useCallback(() => {
    if (tx.status === TxStatus.CONFIRMED) {
      tx.reset();
    }
  }, [tx]);

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onClose={onClose}
        onClosing={handleClose}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        hasBackdrop
        canOutsideClickClose
        canEscapeKeyClose
      >
        <div className="custom-dialog-container">
          <div className="custom-dialog tw-font-body">
            <div className="tw-relative tw-w-full tw-text-sov-white tw-tracking-normal tw-bg-black tw-rounded-2xl tw-p-7 tw-max-w-md tw-mx-auto">
              {tx.status === TxStatus.CONFIRMED ? (
                <>
                  <h2 className="tw-mb-11 tw-mt-4 tw-text-3xl tw-font-medium tw-text-center tw-transform-none tw-leading-6">
                    {t(
                      translations.portfolioPage.claimDialog
                        .redemptionSuccessful,
                    )}
                  </h2>
                  <Icon
                    icon="success-tx"
                    size={55}
                    className="tw-mx-auto tw-my-12 tw-text-success"
                  />
                  <p className="tw-text-center">
                    <Trans
                      i18nKey={t(
                        translations.portfolioPage.claimDialog.vestedSovLink,
                      )}
                      components={[
                        <a
                          href={`${bitocracyUrl}/stake`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          x
                        </a>,
                      ]}
                    />
                  </p>

                  <p className="tw-font-bold tw-text-center tw-mt-8 tw-mx-auto tw-max-w-72">
                    {t(translations.portfolioPage.claimDialog.congratulations)}
                  </p>

                  <div className="tw-mt-12 tw-flex tw-items-center tw-justify-center">
                    <div className="tw-mr-8">
                      {t(translations.portfolioPage.claimDialog.txHash)}
                    </div>
                    <LinkToExplorer
                      txHash={tx.txHash}
                      className="tw-text-primary"
                    />
                  </div>

                  <div className="tw-mt-12 tw-w-full tw-text-center">
                    <Button
                      text={t(translations.portfolioPage.claimDialog.checkSov)}
                      className="tw-mx-auto"
                      size={ButtonSize.lg}
                      onClick={onClose}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="tw-px-9">
                    <h2 className="tw-mb-11 tw-mt-4 tw-text-3xl tw-font-medium tw-text-center tw-transform-none tw-leading-6">
                      {t(
                        translations.portfolioPage.claimDialog.redeemOriginsSOV,
                      )}
                    </h2>
                    <p>
                      {t(translations.portfolioPage.claimDialog.requiresRBTC)}
                    </p>
                    <FieldGroup
                      label={t(
                        translations.portfolioPage.claimDialog
                          .originsBTCdeposit,
                      )}
                    >
                      <DummyField>
                        <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-relative">
                          <div className="tw-w-full tw-flex-grow tw-text-center">
                            {toNumberFormat(Number(btcAmount) / 1e8, 5)}
                          </div>
                          <div className="tw-flex-shrink tw-flex-grow-0 tw-absolute tw-right-0">
                            {t(translations.portfolioPage.claimDialog.btc)}
                          </div>
                        </div>
                      </DummyField>
                    </FieldGroup>
                    <Icon
                      icon="arrow-down-wide"
                      className="tw-mx-auto tw-m-5"
                      size={50}
                    />
                    <FieldGroup
                      label={t(
                        translations.portfolioPage.claimDialog.claimedSov,
                        { count: pricePerSov },
                      )}
                    >
                      <DummyField>
                        <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-relative">
                          <div className="tw-w-full tw-flex-grow tw-text-center">
                            {weiToNumberFormat(sovAmount, 2)}
                          </div>
                          <div className="tw-flex-shrink tw-flex-grow tw-absolute tw-right-0">
                            {t(translations.portfolioPage.claimDialog.sov)}
                          </div>
                        </div>
                      </DummyField>
                    </FieldGroup>
                    <div className="tw-text-white tw-text-sm tw-font-normal tw-mx-9 tw-my-5">
                      {t(translations.common.fee, { amount: '0.0001' })}
                    </div>
                  </div>

                  <TransactionDialog tx={tx} />

                  <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <Button
                      text={t(translations.common.confirm)}
                      className="tw-mr-4 tw-w-full"
                      size={ButtonSize.lg}
                      loading={tx.loading || loading}
                      disabled={
                        tx.loading ||
                        [TxStatus.PENDING_FOR_USER, TxStatus.PENDING].includes(
                          tx.status,
                        ) ||
                        loading ||
                        !Number(sovAmount)
                      }
                      onClick={handleSubmit}
                    />
                    <Button
                      text={t(translations.common.cancel)}
                      className="tw-ml-4 tw-w-full"
                      size={ButtonSize.lg}
                      style={ButtonStyle.inverted}
                      onClick={onClose}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
};
