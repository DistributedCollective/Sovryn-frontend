import bzxAbi from './abi/bzxAbi.json';

export const appContracts = {
  sovrynProtocol: {
    address: '0x6E2fb26a60dA535732F8149b25018C9c0823a715',
    abi: bzxAbi,
    watchEvents: ['Borrow', 'Burn', 'Mint', 'Transfer', 'Approval'],
  },
};
