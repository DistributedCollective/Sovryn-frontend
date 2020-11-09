/* --- STATE --- */

export interface EmailNotificationState {
  attributes: {
    DOUBLE_OPT_IN: number;
    NAME: string;
    WALLET_ADDRESS: string;
  };
  createdAt: Date;
  email: string;
  emailBlacklisted: boolean;
  id: number;
  listIds: Array<number>;
  modeifiedAt: Date;
  smsBlacklisted: boolean;
}

export type ContainerState = EmailNotificationState;
