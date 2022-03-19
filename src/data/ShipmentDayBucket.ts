import { Shipment } from "./Shipment";
import {differenceInDays, format, isAfter, isSameDay} from "date-fns";

export type ShipmentDayBucket = {
    date: string,
    dayOfWeek: string,
    shipments: Shipment[]
}

/**
 * Given a selection of Shipments, this function will aggregate them based on
 *  their <code>estimatedArrival</code> properties into date-specific buckets. The returned
 *  array of ShipmentDayBucket objects will be sorted based on their dates in ascending order.
 *
 * Additionally, this method currently is filtering out any shipments that are not within the next
 * 7 days in an effort to model the functionality required by the Dashboard.
 *
 * @param {Shipment[]} shipments
 *
 * @return {ShipmentDayBucket[]}
 */
export const aggregateShipmentsIntoBuckets = (shipments: Shipment[]): ShipmentDayBucket[] => {
    const currentDate = new Date()
    return shipments
        .filter(shipment => {
            const arrivalDate = new Date(shipment.estimatedArrival)

            //Only deal with dates that are today or the future
            if (!isAfter(arrivalDate, currentDate) && !isSameDay(arrivalDate, currentDate)) {
                return false
            }

            //This intentionally allows 8 possible days (0 - 7, Today + 7 more days)
            return differenceInDays(arrivalDate, currentDate) <= 7
        })
        .reduce<ShipmentDayBucket[]>((dayBuckets, shipment) => {
            const arrivalDate = shipment.estimatedArrival

            let dayBucket = dayBuckets.find(group => group.date === arrivalDate)
            if (!dayBucket) {
                dayBucket = {
                    date: arrivalDate,
                    dayOfWeek: format(new Date(arrivalDate), 'EEEE'),
                    shipments: []
                }
                dayBuckets.push(dayBucket)
            }

            dayBucket.shipments.push(shipment)

            return dayBuckets
        }, [])
        .sort((bucket1, bucket2) => bucket1.date.localeCompare(bucket2.date))
}
