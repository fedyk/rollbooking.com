import * as parseInt from "parse-int";
import { layout as layoutView } from "../../views/booking/layout";
import { connect } from "../../lib/database";
import { getSalonById } from "../../queries/salons";
import { Context } from "koa";
import { ReservationsCollection, SalonsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";

export async function reservation(ctx: Context) {
  const salonId = ctx.params.salonId as string;
  const reservationId = ctx.query.id as string;
  const $salons = await SalonsCollection();
  const $reservations = await ReservationsCollection();

  ctx.assert(ObjectID.isValid(salonId), 404, "Page doesn't exist");
  ctx.assert(ObjectID.isValid(reservationId), 404, "Page doesn't exist");

  const salon = await $salons.findOne({
    _id: new ObjectID(salonId)
  })

  ctx.assert(salon, 404, "Page doesn't exist");

  const reservation = await $reservations.findOne({
    _id: new ObjectID(reservationId)
  })

  ctx.assert(reservation, 404, "Reservation doesn't exist")

  ctx.body = layoutView({
    title: "Test Salon",
    body: `<pre>${JSON.stringify(reservation, null, 2)}</pre>
    `
  })
}