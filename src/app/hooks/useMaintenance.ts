import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  actions,
  maintenanceSlice,
  reducer as maintenanceReducer,
} from 'store/global/maintenance-store/slice';
import { selectMaintenanceState } from 'store/global/maintenance-store/selectors';
import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';
import { useEffect } from 'react';

export function useMaintenance() {
  useInjectReducer({ key: maintenanceSlice, reducer: maintenanceReducer });
  useInjectSaga({ key: maintenanceSlice, saga: maintenanceStateSaga });
  const dispatch = useDispatch();
  const store = useSelector(selectMaintenanceState);

  useEffect(() => {
    if (!store || Object.keys(store).length === 0) {
      dispatch(actions.fetchMaintenanceState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMaintenance = (name: string) => {
    return store[name] || null;
  };

  return { checkMaintenance };
}
