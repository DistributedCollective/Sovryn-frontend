import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
  actions,
  maintenanceSlice,
  reducer as maintenanceReducer,
} from 'store/global/maintenance-store/slice';
import {
  selectMaintenance,
  selectLoading,
} from 'store/global/maintenance-store/selectors';
import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';

export function useMaintenance() {
  useInjectReducer({ key: maintenanceSlice, reducer: maintenanceReducer });
  useInjectSaga({ key: maintenanceSlice, saga: maintenanceStateSaga });
  const dispatch = useDispatch();
  const states = useSelector(selectMaintenance);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    if (isLoading === true) return;

    dispatch(actions.fetchMaintenance());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMaintenance = (name: string) => {
    return states[name] || null;
  };

  return { checkMaintenance };
}
