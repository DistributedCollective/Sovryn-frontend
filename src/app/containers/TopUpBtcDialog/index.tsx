/**
 *
 * TopUpBtcDialog
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectTopUpBtcDialog } from './selectors';
import { topUpBtcDialogSaga } from './saga';
import { translations } from '../../../locales/i18n';
import { Dialog } from '../Dialog/Loadable';

interface Props {}

export function TopUpBtcDialog(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: topUpBtcDialogSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const topUpBtcDialog = useSelector(selectTopUpBtcDialog);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <Dialog
      isOpen={topUpBtcDialog.dialogOpen}
      onClose={() => dispatch(actions.showDialog(false))}
    >
      <div>{t(translations.topUpBtcDialog.meta.title)}</div>
    </Dialog>
  );
}
