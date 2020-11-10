import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { useAccount } from '../../hooks/useAccount';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';

// The initial state of the EmailNotification container
export const initialState: ContainerState = {
  attributes: {
    DOUBLE_OPT_IN: 0,
    NAME: '',
    WALLET_ADDRESS: '',
  },
  createdAt: '',
  email: '',
  emailBlacklisted: false,
  id: 0,
  listIds: [],
  modifiedAt: '',
  smsBlacklisted: false,
};

const emailNotificationSlice = createSlice({
  name: 'emailNotification',
  initialState,
  reducers: {
    getUser(state) {
      alert('Get User function from slice');
      state.email = 'testEmail';
    },
  },
});

export const { actions, reducer, name: sliceKey } = emailNotificationSlice;
