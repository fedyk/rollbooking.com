import { DateTime } from "./date-time";

export interface Reservation {
  id: string;
  businessId: string;
  clientId: string;
  userId: string;
  serviceId: number;
  start: DateTime;
  end: DateTime;
  status: Status;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
  Deleted = 4,
}
