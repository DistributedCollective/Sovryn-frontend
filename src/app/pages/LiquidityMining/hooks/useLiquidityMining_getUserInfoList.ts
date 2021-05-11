import { useEffect } from 'react';
import { createState, useState } from '@hookstate/core';
import type { Response } from 'app/hooks/useCacheCallWithValue';
import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

export const lmUserGlobalState = createState<Response<Array<any>>>({
  value: [],
  loading: false,
  error: null,
});

export function useLiquidityMining_fetchUserInfoList() {
  const state = useState(lmUserGlobalState);

  const data = useCacheCallWithValue<Array<any>>(
    'liquidityMiningProxy',
    'getUserInfoList',
    [],
    useAccount(),
  );

  useEffect(() => {
    console.log(data);
    state.set(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  return state.get();
}

export function useLiquidityMining_getUserInfoList() {
  return useState(lmUserGlobalState).get();
}
