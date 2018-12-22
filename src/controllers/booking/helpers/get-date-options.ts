import { BookingWorkday } from "../../../models/booking-workday";
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";

export function getDateOptions(bookingWorkdays: BookingWorkday[], nextDays): SelectOption[] {
  const date = new Date();
  const options: SelectOption[] = [];

  const availableDates: {
    [key: string]: boolean
  } = {};

  bookingWorkdays.forEach(bookingWorkday => {
    const isoDate = dateToISODate(bookingWorkday.period.startDate);

    availableDates[isoDate] = true;
  })

  for (let i = 0; i < nextDays; i++) {
    const optionValue = date.toISOString().slice(0, 10);
    const optionText = date.toLocaleDateString();
    const optionsDisabled = !availableDates[optionValue];

    options.push({
      value: optionValue,
      text: optionText,
      disabled: optionsDisabled
    });

    // next day
    date.setDate(date.getDate() + 1);
  }

  return options;
}
