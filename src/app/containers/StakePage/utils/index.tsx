import { translations } from 'locales/i18n';
import { StakeHistoryAction } from 'utils/graphql/rsk/generated';

export const getActionName = (action: StakeHistoryAction) => {
  switch (action) {
    case StakeHistoryAction.Stake:
      return translations.stake.history.actions.stake;
    case StakeHistoryAction.Unstake:
      return translations.stake.history.actions.unstake;
    case StakeHistoryAction.FeeWithdrawn:
      return translations.stake.history.actions.feeWithdraw;
    case StakeHistoryAction.IncreaseStake:
      return translations.stake.history.actions.increase;
    case StakeHistoryAction.ExtendStake:
      return translations.stake.history.actions.extend;
    case StakeHistoryAction.Delegate:
      return translations.stake.history.actions.delegate;
    case StakeHistoryAction.WithdrawStaked:
      return translations.stake.history.actions.withdraw;
    default:
      return action;
  }
};
