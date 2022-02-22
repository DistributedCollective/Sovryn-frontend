import { useMaintenance } from 'app/hooks/useMaintenance';

export const usePerpetual_isTradingInMaintenance = () => {
  const { checkMaintenance, States } = useMaintenance();

  return (
    true ||
    true
  );
};
