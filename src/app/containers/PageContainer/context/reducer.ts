import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import {
  PageContextAction,
  PageContextActionType,
  PageContextState,
} from '../types';
import { initialState } from './PageContext';

export const reducer = (
  prevState: PageContextState = initialState,
  action: PageContextAction,
) => {
  switch (action.type) {
    case PageContextActionType.UPDATE_OPTIONS:
      return {
        ...prevState,
        options: merge(cloneDeep(prevState.options), action.value),
      };
    case PageContextActionType.SET_OPTIONS:
      return { ...prevState, options: action.value };
    default:
      return prevState;
  }
};
