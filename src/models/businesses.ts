import { Db } from "mongodb";
import { TimePeriod } from "../types/time-period";
import { SpecialHourPeriod } from "../types/special-hour-period";

export interface Business {
  id: string
  name: string
  alias: string
  avatarUrl: string
  description: string
  timezone: string
  ownerId: string
  employees: Employee[]
  services: Service[]
  servicesCount: number
  regularHours: TimePeriod[]
  specialHours: SpecialHourPeriod[]
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: "owner" | "admin" | "normal"
  position?: string
}

export interface Service {
  id: number
  name: string
  description: string
  /** service duration in minutes */
  duration: number
  /** ISO 4217 */
  currencyCode: string
  price: number
}

export function getCollection(db: Db) {
  return db.collection<Business>("businesses")
}

export function getBusinessById(db: Db, id: string) {
  return getCollection(db).findOne({ id })
}

export function getRecentBusinesses(db: Db) {
  return getCollection(db).find().limit(20).toArray()
}

export function createAccount(db: Db, business: Business) {
  return getCollection(db).insertOne(business).then(r => r.insertedId)
}

export function pushEmployee(db: Db, businessId: string, employee: Employee) {
  return getCollection(db).updateOne({
    id: businessId
  }, {
    $push: {
      employees: employee
    }
  })
}
export function pushService(db: Db, businessId: string, service: Service) {
  return getCollection(db).updateOne(
    {
      id: businessId
    },
    {
      $inc: {
        servicesCount: 1
      },
      $push: {
        services: service
      }
    }
  )
}

export function updateService(db: Db, businessId: string, serviceId: number, service: Service) {
  return getCollection(db).updateOne(
    {
      id: businessId,
      "services.id": serviceId,
    },
    {
      $set: {
        "services.$": service
      }
    }
  )
}