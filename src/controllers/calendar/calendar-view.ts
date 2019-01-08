
import { Salon } from "../../models/salon";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";
import { Reservation } from "../../models/reservation";
import { Date as DateObject } from "../../models/date";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";

interface Props {
  date: DateObject
  reservations: Reservation[]
}

export function calendarView(props: Props) {
  return `
    <h3>Calendar</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">User</th>
          <th scope="col">SalonId</th>
          <th scope="col">MasterId</th>
        </tr>
      </thead>
      <tbody>
        ${stringMapJoin(props.reservations, (reservation) => `<tr>
          <td>${dateTimeToNativeDate(reservation.start)} - ${dateTimeToNativeDate(reservation.start)}</td>
          <td>${reservation.userId}</td>
          <td>${reservation.salonId}</td>
          <td>${reservation.masterId}</td>
          <td>
            <a class="badge badge-light" ${attrs({ href: `/booking/${reservation.salonId}` })}>Booking</a>
          </td>
        </tr>`)}
      </tbody>
    </table>
  `
}
