import { Asset } from 'types';

export type UserCheckpoint = {
  asset: Asset;
  checkpointNum: number;
  hasFees: boolean;
  hasSkippedCheckpoints: boolean;
};
