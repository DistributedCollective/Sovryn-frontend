import axios from 'axios';
import { Sovryn } from '../sovryn';
import { backendUrl, currentChainId } from '../classifiers';

const mailSrv = backendUrl[currentChainId];

//ADD USER
export function createUser(newUser): string | void {
  axios
    .post(mailSrv + '/addUser', newUser)
    .then(res => {
      console.log('data: ' + res.data);
      return 'success';
    })
    .catch(e => {
      console.log('error on adding user');
      console.log(e);
      return 'error';
    });
}

//UPDATE USER
export function updateUser(
  updatedUser,
  name,
  email,
  walletAddress,
  handleUpdateSuccess,
  handleUpdateError,
) {
  const timestamp = new Date();

  const message = `${timestamp} \n \n Please confirm that the details associated with this account will now be: \n \n Username: ${name} \n Email: ${email}`;

  Sovryn.getWriteWeb3()
    .eth.personal.sign(message, walletAddress, '')
    .then(res =>
      axios
        .post(mailSrv + '/updateUser', {
          ...updatedUser,
          signedMessage: res,
          message: message,
        })
        .then(res => {
          handleUpdateSuccess();
          console.log(res.data);
        })
        .catch(e => {
          handleUpdateError();
          console.log(e);
        }),
    );
}

//GET USER
export function getUser(walletAddress, getUserSuccess, getUserError) {
  axios
    .post(mailSrv + '/getUser', {
      walletAddress: walletAddress,
    })
    .then(res => {
      getUserSuccess(res);
    })
    .catch(e => {
      getUserError(e);
    });
}
