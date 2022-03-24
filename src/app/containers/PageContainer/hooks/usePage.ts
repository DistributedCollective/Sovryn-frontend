import { useContext } from 'react';
import { PageContext } from '../context/PageContext';

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error(
      `usePage hook cannot be used outside the PageContext container`,
    );
  }
  return context;
};

export const usePageState = () => {
  return usePage().state;
};

export const usePageActions = () => {
  return usePage().actions;
};
