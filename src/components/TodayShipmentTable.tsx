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
  }
})

export type TodayShipmentsTableProps = {
  shipmentBucket: ShipmentDayBucket | undefined
}

export const TodayShipmentsTable: React.FC<TodayShipmentsTableProps> = ({ shipmentBucket }) => {
  const classes = useStyles()

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell>House Bill Number</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            !shipmentBucket || shipmentBucket.shipments.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={2} style={{ textAlign: 'center' }}>No Shipments for Today</TableCell>
                </TableRow>
              )
              : shipmentBucket.shipments.map((shipment, idx) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.houseBillNumber}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
