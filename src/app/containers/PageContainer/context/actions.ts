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
      updateOptions: (options: Partial<PageOptions>) =>
        dispatch({
          type: PageContextActionType.UPDATE_OPTIONS,
          value: options,
        }),
      setOptions: (options: PageOptions = initialState.options) =>
        dispatch({
          type: PageContextActionType.SET_OPTIONS,
          value: options,
        }),
    }),
    [dispatch],
  );
  return memoized;
};
