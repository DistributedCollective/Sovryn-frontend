/* --- STATE --- */

export interface EmailNotificationState {
  attributes: {
    DOUBLE_OPT_IN: number;
    NAME: string;
    WALLET_ADDRESS: string;
  };
  createdAt: string;
  email: string;
  emailBlacklisted: boolean;
  id: number;
  listIds: Array<number>;
  modifiedAt: string;
  smsBlacklisted: boolean;
}

export type ContainerState = EmailNotificationState;
