/**
 *
 * SandboxPage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider/dist/cjs/index';
import { Button, Dialog } from '@blueprintjs/core';
import { rpcNodes, readNodes } from '../../../utils/classifiers';
import { toHex } from 'web3-utils';

const providerOptions = {
  walletconnect: {
    display: {
      // logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
      name: 'Mobile',
      description: 'Scan qrcode with your mobile wallet',
    },
    package: WalletConnectProvider,
    options: {
      rpc: rpcNodes,
    },
  },
};

const web3Modal = new Web3Modal({
  // network: 'mainnet', // optional
  // network: 'testnet',
  disableInjectedProvider: false,
  cacheProvider: true, // optional
  providerOptions, // required
});

function initWeb3(provider: any) {
  // const web3: any = new Web3(new Web3.providers.WebsocketProvider(readNodes[provider.chainId]));
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

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

  const [state, setState] = useState<any>({
    address: '',
    web3: null,
    provider: null,
    connected: false,
    chainId: 1,
    networkId: 1,
    showModal: false,
    pendingRequest: false,
    result: null,
  });

  const subscribeProvider = useCallback(
    async (provider: any) => {
      if (!provider.on) {
        return;
      }
      provider.on('close', () => resetApp());
      provider.on('accountsChanged', async (accounts: string[]) => {
        await setState(prevState => ({ ...prevState, address: accounts[0] }));
      });
      provider.on('chainChanged', async (chainId: number) => {
        const { web3 } = state;
        const networkId = await web3.eth.net.getId();
        await setState(prevState => ({ ...prevState, chainId, networkId }));
      });

      provider.on('networkChanged', async (networkId: number) => {
        const { web3 } = state;
        const chainId = await web3.eth.chainId();
        await setState(prevState => ({ ...prevState, chainId, networkId }));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  const onConnect = useCallback(async () => {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    setState(prevState => ({
      ...prevState,
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
    }));
    // await this.getAccountAssets();
  }, [subscribeProvider]);

  const resetApp = useCallback(async () => {
    const { web3 } = state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setState({
      fetching: false,
      address: '',
      web3: null,
      provider: null,
      connected: false,
      chainId: 1,
      networkId: 1,
      assets: [],
      showModal: false,
      pendingRequest: false,
      result: null,
    });
  }, [state]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
    //
    // const init = async () => {
    //
    //
    //   const provider = await web3Modal.connect();
    //
    //   const web3 = new Web3(provider);
    //
    //   setState(prevState => ({ ...prevState, provider, web3 }));
    // };
    //
    // init().then(console.log).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const sendTx = async () => {
    const { web3, address, chainId } = state;

    console.log('send tx', state);

    if (!web3) {
      return;
    }

    const tx = await formatTestTransaction(address, chainId);

    try {
      // toggle pending request indicator
      setState(prevState => ({
        ...prevState,
        showModal: true,
        pendingRequest: true,
      }));

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
      setState(prevState => ({
        ...prevState,
        pendingRequest: false,
        result: formattedResult || null,
      }));
    } catch (error) {
      console.error(error); // tslint:disable-line
      setState(prevState => ({
        ...prevState,
        pendingRequest: false,
        result: null,
      }));
    }
  };

  const closeConnection = () => {
    resetApp();
  };

  return (
    <>
      <div className="container">
        {!state.connected && (
          <Button text="Connect" onClick={() => onConnect()} />
        )}

        {state.connected && (
          <>
            <Button text="send tx" onClick={sendTx} />
            <Button text="disconnect" onClick={closeConnection} />
          </>
        )}

        <Dialog
          isOpen={state.showModal}
          onClose={() =>
            setState(prevState => ({ ...prevState, showModal: false }))
          }
        >
          {state.pendingRequest && <>Pending tx.</>}
          {state.result ? 'Success' : 'Failed.'}
        </Dialog>
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
