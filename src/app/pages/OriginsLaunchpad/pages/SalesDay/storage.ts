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
    const data = local.getItem(originsSaleStorageKey);
    return data ? JSON.parse(data) : defaultData;
  },
};

export default saleStorage;
