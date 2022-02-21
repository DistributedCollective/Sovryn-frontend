import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, PerpetualPageModals } from './types';
import { Asset } from '../../../types';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';

// The initial state of the MarginTradePage container
export const initialState: ContainerState = {
  pairType: PerpetualPairType.BTCUSD,
  collateral: Asset.RBTC,
  useMetaTransactions: false,
  modal: PerpetualPageModals.NONE,
  modalOptions: undefined,
  toastedTransactions: [],
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
  },
});

export const { actions, reducer, name: sliceKey } = perpetualPageSlice;
