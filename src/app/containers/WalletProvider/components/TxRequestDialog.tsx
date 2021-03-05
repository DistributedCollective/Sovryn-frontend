import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';
import { Dialog } from '../../Dialog/Loadable';
import {
  RequestDialogState,
  TxType,
} from '../../../../store/global/transactions-store/types';
import { actions } from 'store/global/transactions-store/slice';
import { translations } from '../../../../locales/i18n';
import { TradeButton } from '../../../components/TradeButton';
import { weiTo4 } from '../../../../utils/blockchain/math-helpers';

interface Props extends RequestDialogState {}

export function TxRequestDialog({ open, type, amount, asset, error }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => dispatch(actions.closeTransactionRequestDialog())}
        isCloseButtonShown={false}
      >
        {type === TxType.APPROVE && (
          <section className="tw-flex tw-flex-col tw-items-center tw-justify-center">
            <header className="tw-mb-4">
              <h3>
                {t(translations.walletProvider.txRequestDialog.approve.title)}
              </h3>
            </header>
            {error ? (
              <>
                <p>
                  {t(translations.walletProvider.txRequestDialog.approve.error)}
                </p>
                <div className="alert alert-warning">{error}</div>
                <TradeButton
                  text={t(
                    translations.walletProvider.txRequestDialog.closeButton,
                  )}
                  onClick={() =>
                    dispatch(actions.closeTransactionRequestDialog())
                  }
                />
              </>
            ) : (
              <>
                <p>
                  {t(
                    translations.walletProvider.txRequestDialog.approve
                      .description,
                    { asset, amount: weiTo4(amount) },
                  )}
                </p>
                <div className="tw-text-center tw-my-2">
                  <Spinner size={28} />
                </div>
              </>
            )}
          </section>
        )}
      </Dialog>
    </>
  );
}
