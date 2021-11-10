import { originsSaleStorageKey } from 'utils/classifiers';
import { local } from 'utils/storage';

export interface ISalesData {
  step: number;
}

const defaultData: ISalesData = {
  step: 1,
};

const saleStorage = {
  saveData: (data: ISalesData): void => {
    local.setItem(originsSaleStorageKey, JSON.stringify(data));
  },
  getData: (): ISalesData => {
    const strData = local.getItem(originsSaleStorageKey);
    return strData ? (JSON.parse(strData) as ISalesData) : defaultData;
  },
};

export default saleStorage;
