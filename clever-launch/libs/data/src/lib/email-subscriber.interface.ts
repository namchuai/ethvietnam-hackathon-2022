export interface EmailSubscriber {
  email: string;

  name?: string;

  subscriberType: SubscriberType;

  status: SubscribeStatus;

  updatedAt: number;
}

export enum SubscribeStatus {
  Subscribe = 'Subscribed',
  Unsubscribe = 'Unsubscribed',
}

export enum SubscriberType {
  Backer = 'Backer',
  Creator = 'Creator',
  None = 'None',
}
