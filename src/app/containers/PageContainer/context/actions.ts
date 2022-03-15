import { Dispatch, useMemo } from 'react';
import {
  PageContextAction,
  PageContextActionType,
  PageOptions,
} from '../types';
import { initialState } from './PageContext';

export const useActions = (dispatch: Dispatch<PageContextAction>) => {
  const memoized = useMemo(
    () => ({
      setOptions: (options: Partial<PageOptions>) =>
        dispatch({ type: PageContextActionType.SET_OPTIONS, value: options }),
      clearOptions: (options: Partial<PageOptions> = initialState.options) =>
        dispatch({
          type: PageContextActionType.CLEAR_OPTIONS,
          value: options,
        }),
    }),
    [dispatch],
  );
  return memoized;
};
