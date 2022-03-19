import {
  makeStyles,
  Paper,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';

import { ShipmentDayBucket } from '../data/ShipmentDayBucket';

const useStyles = makeStyles({
  tableContainer: {
    width: 'auto',
    '& thead th': {
      fontWeight: 'bold'
    }
  },
  upcomingShipmentTable: {
    '& tbody th': {
      borderRight: '1px solid rgba(224, 224, 224, 1)'
    }
  },
  lastShipmentOfDay: {
    '& td': {
      borderBottomWidth: '3px'
    }
  }
})

export type UpcomingShipmentsTableProps = {
  shipmentDayBuckets: ShipmentDayBucket[]
}

export const UpcomingShipmentsTable: React.FC<UpcomingShipmentsTableProps> = ({ shipmentDayBuckets }) => {
  const classes = useStyles()

  return (
    <TableContainer
      className={classes.tableContainer}
      component={Paper}>
      <Table
        className={classes.upcomingShipmentTable}
        stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell>Estimated Arrival</TableCell>
            <TableCell>House Bill Number</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            shipmentDayBuckets.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>No upcoming shipments in next week</TableCell>
                </TableRow>
              )
              : shipmentDayBuckets.map((bucket, bucketIdx) => {
                const isLastBucket = bucketIdx === shipmentDayBuckets.length - 1
                return bucket.shipments.map((shipment, idx) => {
                  const isLastShipment = idx === bucket.shipments.length - 1
                  return (
                    <TableRow
                      className={isLastShipment && !isLastBucket ? classes.lastShipmentOfDay : undefined}
                      key={shipment.id}>
                      {idx === 0
                        ? <TableCell
                          component="th"
                          scope="rowgroup"
                          rowSpan={bucket.shipments.length}
                          style={{
                            //Because the <th> is only rendered for the _first_ row as it rowSpans
                            // across them all, we only need to check if this is the last bucket rendered.
                            borderBottomWidth: !isLastBucket ? '3px' : undefined
                          }}>
                          {bucket.dayOfWeek}
                          <br />
                          {bucket.date}
                        </TableCell>
                        : null
                      }
                      <TableCell>{shipment.houseBillNumber}</TableCell>
                      <TableCell>{shipment.status}</TableCell>
                    </TableRow>
                  )
                })
              })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
