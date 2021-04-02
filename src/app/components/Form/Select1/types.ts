export interface Option<K = string, V = string, P = any> {
  key: K;
  label: V;
  data?: P;
}

export type Options<K = string, V = string, P = any> = Option<K, V, P>[];
