import Web3 from 'web3';

export const createWeb3 = (): Web3 => {
  let web3;
  // @ts-ignore
  if (window.ethereum) {
    // @ts-ignore
    web3 = new Web3(window.ethereum);
    // @ts-ignore
    window.ethereum.enable();
  } else {
    web3 = new Web3(process.env.REACT_APP_PUBLIC_NODE as string);
  }
  return web3;
};
