import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { useAccount } from '../../hooks/useAccount';
import axios from 'axios';

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

const walletAddress = '0xtesttesttest';
const mailApiKey = process.env.REACT_APP_MAIL_API_KEY;
const mailSrv = process.env.REACT_APP_MAIL_SRV;

const emailNotificationSlice = createSlice({
  name: 'emailNotification',
  initialState,
  reducers: {
    setFoundUser(state) {
      axios
        .post(
          mailSrv + 'getUser',
          {
            walletAddress: walletAddress,
          },
          {
            headers: {
              Authorization: mailApiKey,
            },
          },
        )
        .then(res => {
          console.log('got user');
          console.log(res.data);
          state = res.data;
        })
        .catch(e => console.log(e));
    },
  },
});

export const { actions, reducer, name: sliceKey } = emailNotificationSlice;
