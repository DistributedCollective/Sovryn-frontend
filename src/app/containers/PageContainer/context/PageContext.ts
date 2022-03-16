import { createContext } from 'react';
import {
  PageContextState,
  PageContextType,
  HeaderTypes,
  FooterTypes,
} from '../types';

export const initialState: PageContextState = {
  options: {
    header: HeaderTypes.DEFAULT,
    footer: FooterTypes.DEFAULT,
  },
};

export const PageContext = createContext<PageContextType>({
  state: initialState,
  actions: {},
} as PageContextType);
