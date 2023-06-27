import { utils } from '@rsksmart/rsk3';
import { bignumber } from 'mathjs';
import type { Decimal } from 'decimal.js';
import { currentChainId } from './classifiers';
import { gas } from './blockchain/gas-price';
import { Asset } from '../types';
import { ProviderType } from '@sovryn/wallet';
import { walletService } from '@sovryn/react-wallet';
import { CachedAssetRate } from 'app/containers/WalletProvider/types';
import { numberFromWei } from './blockchain/math-helpers';
import {
  MAX_PROCESSABLE_CHECKPOINTS_SOV,
  MAX_PROCESSABLE_CHECKPOINTS_TOKENS,
  MAX_PROCESSABLE_CHECKPOINTS_ZUSD,
} from 'app/constants';

export const isObjectEmpty = (obj: {}) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const booleafy = (value: boolean) => (value ? 1 : 0);

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};

export const handleNumberInput = (value, onlyPositive = true) => {
  return handleNumber(value.currentTarget.value, onlyPositive);
};

export const handleNumber = (value, onlyPositive = true) => {
  if (value === undefined || value === null) {
    value = '';
  }

  if (value === '') {
    return value;
  }

  let number = value.replace(',', '.').replace(/[^\d.-]/g, '');

  if (onlyPositive && Number(number) < 0) {
    return '0';
  }

  if (number.length === 1 && number === '.') {
    return '0.';
  }

  if (isNaN(number) && number !== '-') {
    return '';
  }

  return number.toString();
};

export const toChecksumAddress = (address: string) => {
  try {
    return !!address ? utils.toChecksumAddress(address) : '';
  } catch (e) {
    return address;
  }
};

export const checkAddressChecksum = (address: string) => {
  try {
    return utils.checkAddressChecksum(address, currentChainId);
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const isAddress = (address: string) => {
  try {
    return utils.isAddress((address || '').toLowerCase(), currentChainId);
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const areAddressesEqual = (address1: string, address2: string) =>
  address1.toLowerCase() === address2.toLowerCase();

export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const toChunks = (from: number, to: number, size: number) => {
  let end = from;
  let array: Array<number[]> = [];
  const amount = to - from;
  const chunks = Math.floor(amount / size);
  const reminder = amount % size;

  if (chunks) {
    for (let i = 0; i < chunks; i++) {
      const chunkEnd = end + size;
      array.push([end, chunkEnd - 1]);
      end = chunkEnd;
    }
  }
  if (reminder) {
    array.push([end, end + reminder]);
  }
  return array;
};

export const maxMinusFee = (
  amount: any,
  asset: Asset = Asset.RBTC,
  limit: number = 2000000,
) => {
  if (asset !== Asset.RBTC) return amount;
  const gasPrice = gas.get();
  const fee = bignumber(gasPrice).mul(limit);
  const balance = bignumber(amount).sub(fee);
  if (balance.lessThanOrEqualTo(0)) {
    return '0';
  }
  return balance.toFixed(0);
};

/**
 * Returns true if value is one of true, 1, on or yes.
 * All other values considered as false
 * @param value
 */
export function isChecked(value: any) {
  value = String(value || false).toLowerCase();
  return ['true', '1', 'on', 'yes'].includes(value);
}

export const isMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      // eslint-disable-next-line no-useless-escape
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-\/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ \/])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export const isTablet = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      // eslint-disable-next-line no-useless-escape
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-\/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ \/])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export function detectWeb3Wallet() {
  switch (walletService.providerType) {
    default:
    case ProviderType.WEB3:
      const { ethereum } = window;
      if (ethereum) {
        if (ethereum.isLiquality) return 'liquality';
        if (ethereum.isNiftyWallet) return 'nifty';
        if (ethereum.isMetaMask) return 'metamask';
        return 'unknown';
      }
      return 'none';
    case ProviderType.PORTIS:
      return 'portis';
    case ProviderType.LEDGER:
      return 'ledger';
    case ProviderType.TREZOR:
      return 'trezor';
    case ProviderType.WALLET_CONNECT:
      return 'wallet-connect';
  }
}

export function makeId(length: number = 8): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function fixNumber(amount: any) {
  if (amount === Infinity || amount === 'Infinity' || amount === undefined) {
    return 0;
  }
  if (isNaN(Number(amount))) {
    return 0;
  }
  return amount;
}

export function getUSDSum(array: number[]) {
  return array.reduce(function (sum, value) {
    return sum + value;
  }, 0);
}

export const abbreviateNumber = (
  value: number,
  decimals: number = 2,
): string => {
  if (value < 1000) return String(value);
  const suffixes = ['', 'k', 'm', 'b', 't'];
  const suffixNum = Math.floor(String(value).length / 3);
  let shortValue: any = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
      2 + decimals,
    ),
  );
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(decimals);
  }
  return shortValue + suffixes[suffixNum];
};

export const isNullOrUndefined = val => val === undefined || val === null;

export const getFavoriteList = key => {
  const list = localStorage.getItem(key);
  return list ? JSON.parse(list) : [];
};

export const setFavoriteList = (key: string, list) => {
  return localStorage.setItem(key, JSON.stringify(list));
};

// (b - a) / |a| * 100
export const percentageChange = (a: Decimal.Value, b: Decimal.Value) =>
  bignumber(bignumber(b).minus(a)).div(bignumber(a).abs()).mul(100).toString();

export const parseJwt = (token: string) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

export const calculateAssetValue = (
  asset: Asset,
  amount: string,
  targetAsset: Asset = Asset.RBTC,
  assetRates: CachedAssetRate[],
) => {
  if (asset === targetAsset) {
    return Number(amount);
  }
  if (asset === Asset.ZUSD) asset = Asset.XUSD;
  const rate = fixNumber(
    assetRates.find(
      assetRate =>
        assetRate.source === asset && assetRate.target === targetAsset,
    )?.value?.rate,
  );
  return numberFromWei(bignumber(amount).mul(rate));
};

export const capitalize = (val: string) =>
  val && val.charAt(0).toLocaleUpperCase() + val.slice(1);

export const getMaxProcessableCheckpoints = (asset: Asset) => {
  switch (asset) {
    case Asset.ZUSD:
      return MAX_PROCESSABLE_CHECKPOINTS_ZUSD;
    case Asset.SOV:
      return MAX_PROCESSABLE_CHECKPOINTS_SOV;
    default:
      return MAX_PROCESSABLE_CHECKPOINTS_TOKENS;
  }
};
