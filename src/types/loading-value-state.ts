import { Nullable } from './index';

export interface LoadingValueState<T = any, R = string> {
  value: T;
  loading: boolean;
  error: Nullable<R>;
}
