import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, PerpetualPageModals } from './types';
import { Asset } from '../../../types';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';

// The initial state of the PerpetualPage container
export const initialState: ContainerState = {
  pairType: PerpetualPairType.BTCUSD,
  collateral: Asset.RBTC,
  useMetaTransactions: false,
  modal: PerpetualPageModals.NONE,
  modalOptions: undefined,
  toastedTransactions: [],
  showAmmDepth: true,
  showChart: true,
  showRecentTrades: true,
  showTradeForm: true,
  showTables: true,
};

const perpetualPageSlice = createSlice({
  name: 'perpetualPage',
  initialState,
  reducers: {
    setPairType(state, { payload }: PayloadAction<PerpetualPairType>) {
      state.pairType = payload;
    },
    setCollateral(state, { payload }: PayloadAction<Asset>) {
      state.collateral = payload;
    },
    setUseMetaTransactions(state, { payload }: PayloadAction<boolean>) {
      state.useMetaTransactions = payload;
    },
    setModal: {
      reducer(
        state,
        {
          payload,
          meta,
        }: PayloadAction<
          PerpetualPageModals,
          string,
          ContainerState['modalOptions']
        >,
      ) {
        state.modal = payload;
        state.modalOptions = meta;
      },
      prepare(
        modal: PerpetualPageModals,
        modalOptions?: ContainerState['modalOptions'],
      ) {
        return { payload: modal, meta: modalOptions };
      },
    },
    reset(state) {
      state = initialState;
    },
    pushToastedTransaction(state, { payload }: PayloadAction<string>) {
      state.toastedTransactions = [...state.toastedTransactions, payload];
    },
    setShowAmmDepth(state, { payload }: PayloadAction<boolean>) {
      state.showAmmDepth = payload;
    },
    setShowChart(state, { payload }: PayloadAction<boolean>) {
      state.showChart = payload;
    },
    setShowRecentTrades(state, { payload }: PayloadAction<boolean>) {
      state.showRecentTrades = payload;
    },
    setShowTradeForm(state, { payload }: PayloadAction<boolean>) {
      state.showTradeForm = payload;
    },
    setShowTables(state, { payload }: PayloadAction<boolean>) {
      state.showTables = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = perpetualPageSlice;
