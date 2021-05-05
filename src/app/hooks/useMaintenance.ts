import { useSelector } from 'react-redux';
import { selectMaintenance } from 'store/global/maintenance-store/selectors';

export function useMaintenance() {
  const states = useSelector(selectMaintenance);

  const checkMaintenance = (name: string) => {
    return states[name] || null;
  };

  return { checkMaintenance };
}
