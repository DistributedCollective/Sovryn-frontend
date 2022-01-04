import { useMaintenance } from 'app/hooks/useMaintenance';

export const usePerpetual_isTradingInMaintenance = () => {
  const { checkMaintenance, States } = useMaintenance();

  return (
    checkMaintenance(States.PERPETUALS) ||
    checkMaintenance(States.PERPETUALS_TRADE)
  );
};
