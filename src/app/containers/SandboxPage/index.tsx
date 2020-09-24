/**
 *
 * SandboxPage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { toHex } from 'web3-utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { actions } from '../WalletProvider/slice';
import { Sovryn } from '../../../utils/sovryn';
import { ConnectWalletButton } from '../ConnectWalletButton';

interface Props {}

export function SandboxPage(props: Props) {
  // const state = useSelector(selectWalletProvider);
  //
  // const handleSendTx = () => {
  //   Sovryn.send({
  //     from: state.currentWallet as string,
  //     to: '0xDFEC0328a07C399A7e32364DEfd3bE6aaB9365D3',
  //     value: toWei('0.001'),
  //     data: '0x0',
  //   })
  //     .then(e => {
  //       console.log('log', e);
  //     })
  //     .catch(e => console.error('err', e));
  //
  //   // Sovryn.getWriteWeb3()
  //   //   .eth.signTransaction({
  //   //     from: state.currentWallet as string,
  //   //     to: '0xDFEC0328a07C399A7e32364DEfd3bE6aaB9365D3',
  //   //     value: toWei('0.001'),
  //   //   })
  //   //   .then(e => {
  //   //     console.log('log', e);
  //   //   })
  //   //   .catch(e => console.error('err', e));
  // };
  //
  // const handleSendContractTx = () => {};

  const state = useSelector(selectWalletProvider);
  const dispatch = useDispatch();

  const sendTx = async () => {
    const web3 = Sovryn.getWriteWeb3();
    const { address, chainId } = state;

    console.log('send tx', state);

    if (!web3) {
      return;
    }

    const tx = await formatTestTransaction(address, chainId);

    try {
      // toggle pending request indicator
      // setState(prevState => ({
      //   ...prevState,
      //   showModal: true,
      //   pendingRequest: true,
      // }));

      // @ts-ignore
      function sendTransaction(_tx: any) {
        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(_tx)
            .once('transactionHash', (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
        });
      }

      // send transaction
      const result = await sendTransaction(tx);

      // format displayed result
      const formattedResult = {
        action: 'eth.sendTransaction()',
        txHash: result,
        from: address,
        to: address,
        value: '0 ETH',
      };

      // display result
      // setState(prevState => ({
      //   ...prevState,
      //   pendingRequest: false,
      //   result: formattedResult || null,
      // }));
    } catch (error) {
      console.error(error); // tslint:disable-line
      // setState(prevState => ({
      //   ...prevState,
      //   pendingRequest: false,
      //   result: null,
      // }));
    }
  };

  const closeConnection = () => {
    Sovryn.disconnect().then(console.log).catch(console.error);
  };

  return (
    <>
      <div className="container">
        <ConnectWalletButton />

        {state.connected && (
          <>
            <Button text="send tx" onClick={sendTx} />
            <Button text="disconnect" onClick={closeConnection} />
          </>
        )}

        {/*<Dialog*/}
        {/*  isOpen={state.showModal}*/}
        {/*  onClose={() =>*/}
        {/*    setState(prevState => ({ ...prevState, showModal: false }))*/}
        {/*  }*/}
        {/*>*/}
        {/*  {state.pendingRequest && <>Pending tx.</>}*/}
        {/*  {state.result ? 'Success' : 'Failed.'}*/}
        {/*</Dialog>*/}
      </div>
    </>
  );
}

async function formatTestTransaction(address: string, chainId: number) {
  // from
  const from = address;

  // to
  const to = address;

  // nonce
  // const _nonce = await apiGetAccountNonce(address, chainId);
  // const nonce = sanitizeHex(convertStringToHex(_nonce));

  // gasPrice
  // const gasPrices = await apiGetGasPrices();
  // const _gasPrice = gasPrices.slow.price;
  // const gasPrice = sanitizeHex(
  //   convertStringToHex(convertAmountToRawNumber(_gasPrice, 9))
  // );

  // gasLimit
  const gasLimit = toHex(21000);

  // value
  const value = toHex(0);

  // data
  const data = '0x';

  // test transaction
  const tx = {
    from,
    to,
    // nonce,
    // gasPrice,
    gasLimit,
    value,
    data,
  };

  return tx;
}
