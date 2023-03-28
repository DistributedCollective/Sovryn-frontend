export type NotificationUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  email?: string;
  emailNotificationLastSent?: string;
  role: string;
  emailHash?: string;
  isEmailConfirmed?: boolean;
};

export enum NotificationMessageType {
  Margin_Call = 'Margin_Call',
  Liquidation = 'Liquidation',
  SpotOrderFilled = 'SpotOrderFilled',
  MarginOrderFilled = 'MarginOrderFilled',
  MarginUndercollateralized = 'MarginUndercollateralized',
}

export enum AlertGroup {
  MarginCalls = 'MarginCalls',
  SpotCalls = 'SpotCalls',
}

export const AlertGroupToNotificationsMapping: Record<
  AlertGroup,
  NotificationMessageType[]
> = {
  MarginCalls: [
    NotificationMessageType.Margin_Call,
    NotificationMessageType.MarginOrderFilled,
    NotificationMessageType.MarginUndercollateralized,
    NotificationMessageType.Liquidation,
  ],
  SpotCalls: [NotificationMessageType.SpotOrderFilled],
};

export type Notification = {
  notification: NotificationMessageType;
  isSubscribed: boolean;
};

export const defaultSubscriptionsArray: Notification[] = [
  {
    notification: NotificationMessageType.Margin_Call,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.Liquidation,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.SpotOrderFilled,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.MarginOrderFilled,
    isSubscribed: false,
  },
  {
    notification: NotificationMessageType.MarginUndercollateralized,
    isSubscribed: false,
  },
];
