import { Nullable } from 'types';

export type TableData<T> = {
  items: T[];
  userData: Nullable<T>;
  loaded: boolean;
};
