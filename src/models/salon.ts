import { TimePeriod } from "./time-period";
import { SpecialHourPeriod } from "./special-hour-period";

export interface Salon {
  id: number;
  name: string;
  regular_hours: BusinessHours;
  special_hours: SpecialHours;
  properties: SalonProperties;
  created: Date;
  updated: Date;
}

export interface SalonProperties {
  general: {
    timezone: string;
  }
  currency: {
    symbol: string; // e.g. $
    value: string;  // e.g. USD
  }
}

export interface BusinessHours {
  periods: TimePeriod[]
}

export interface SpecialHours {
  periods: SpecialHourPeriod[]
}
