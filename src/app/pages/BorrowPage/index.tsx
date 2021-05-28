import { ActionButton } from 'form/ActionButton';
// import { useState } from '../RepayPositionHandler/Loadable';
// import CurrencyContainer from './components/CurrencyContainer';
// import CurrencyDetails from './components/CurrencyDetails';
// import LendingHistory from './components/LendingHistory';
import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { CardRow } from 'app/components/FinanceV2Components/CardRow';
import { Header } from 'app/components/Header';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

// import { Footer } from '../../components/BorrowActivity/Loadable';
import { Footer } from '../../components/Footer';
import { BorrowDialog } from './component/Dialog/BorrowDialog';

// import { borrowSovrynSaga } from './saga';
// import { selectLendBorrowSovryn } from './selectors';
// import { actions, reducer, sliceKey } from './slice';

// import './assets/index.scss';

// import { WhitelistedNotification } from '../../components/WhitelistedNotification/Loadable';

type Props = {};
type DialogType = 'none' | 'add' | 'borrow' | 'repay';

export function BorrowPage() {
//   useInjectReducer({ key: sliceKey, reducer: reducer });
//   useInjectSaga({ key: sliceKey, saga: lendBorrowSovrynSaga });
const [dialog, setDialog] = useState<DialogType>('none');
//   const state = useSelector(selectLendBorrowSovryn);
//   const dispatch = useDispatch();
const onCloseDialog = () => {
  setDialog('none');
}
  return (
    <>
      <Header />

      {/* <Container className="tw-mt-6">
        {state.tab === TabType.LEND && <LendingHistory />}
        {state.tab === TabType.BORROW && <BorrowActivity />}
        <RepayPositionHandler />
      </Container> */}
      <div className="tw-max-w-screen-2xl tw-mx-auto tw-mt-5 tw-mb-32">
        <div className="tw-ml-5 tw-w-full tw-max-w-8.75-rem">
          <ActionButton
            text="BORROW"
            onClick={() => setDialog('borrow')}
            className="tw-block tw-w-full tw-mb-3 tw-rounded-lg tw-bg-ctaHover hover:tw-opacity-75"
            textClassName="tw-text-base"
            disabled={false}
          />
          <ActionButton
            text="ADD"
            onClick={() => setDialog('add')}
            className="tw-block tw-w-full tw-rounded-lg"
            textClassName="tw-text-base"
            disabled={false}
          />
          <ActionButton
            text="REPAY"
            onClick={() => setDialog('repay')}
            className="tw-block tw-w-full tw-rounded-lg"
            textClassName="tw-text-base"
            disabled={false}
          />
        </div>
      </div>
      <BorrowDialog
        showModal={dialog === 'borrow' && true}
        onCloseModal={onCloseDialog}
      />
      <Footer />
    </>
  );
}
