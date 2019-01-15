import { UsersCollection, SalonsCollection, closeClient } from "../../adapters/mongodb";
import { User, SalonEmployer } from "../../models/user";
import { createHash } from "crypto";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";


const DEFAULT_TIME_ZONES = [
  "America/Los_Angeles",

  "MST",
  "America/Phoenix",

  "America/Chicago",

  "EST",
  "America/New_York",

  "Europe/Amsterdam",

  "Europe/Berlin",
  "Europe/Kiev",
  "Europe/Moscow",
  "Pacific/Auckland",
]

export async function createTestSalons(timeZones = DEFAULT_TIME_ZONES) {
  const $users = await UsersCollection();
  const $salons = await SalonsCollection();

  const user1: User = {
    name: "Master 1",
    employers: {
      salons: []
    },
    email: `email${Math.round(Math.random() * 1000)}@example.com`,
    password: "",
    properties: {},
  }
  const user2: User = {
    name: "Master 2",
    employers: {
      salons: []
    },
    email: `email${Math.round(Math.random() * 1000)}@example.com`,
    password: "",
    properties: {},
  }

  const userInsertResult1 = await $users.insertOne(user1);
  const userInsertResult2 = await $users.insertOne(user2);

  for (let i = 0; i < timeZones.length; i++) {
    const timezone = timeZones[i];
    const salonHash = Math.round(Math.random() * 1000);

    const salon: Salon = {
      alias: `salon-${salonHash}`,
      name: `Salon ${salonHash} ${timezone}`,
      timezone: timezone,
      employees: {
        users: [{
          id: userInsertResult1.insertedId,
          position: "Senior master"
        }, {
          id: userInsertResult2.insertedId,
          position: "Master"
        }]
      },
      services: {
        lastServiceId: 3,
        items: [{
          id: 1,
          duration: 60,
          name: "Test Service 1",
          currencyCode: "USD",
          price: 100
        }, {
          id: 2,
          duration: 60,
          name: "Test Service 2",
          currencyCode: "USD",
          price: 100.50
        }, {
          id: 3,
          duration: 60,
          name: "Test Service 3",
          currencyCode: "USD",
          price: 5.50
        }]
      },
      regularHours: {
        periods: [{
          openDay: DayOfWeek.MONDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.MONDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }, {
          openDay: DayOfWeek.TUESDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.TUESDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }, {
          openDay: DayOfWeek.WEDNESDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.WEDNESDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        },{
          openDay: DayOfWeek.THURSDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.THURSDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }, {
          openDay: DayOfWeek.FRIDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.FRIDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }]
      },
      specialHours: {
        periods: []
      }
    }

    await $salons.insertOne(salon);
  }
}

if (!module.parent) {
  (async function() {
    try {
      console.log("Start")

      await createTestSalons()

      console.log("Success");
    }
    catch(e) {
      console.error("Fail", e);
    }
    finally {
      await closeClient()
    }
  })()
}