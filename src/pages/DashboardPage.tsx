import {
  Box,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { ReactElement, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { isToday } from 'date-fns'

import { FetchShipmentDayBucketsResult, fetchShipmentsForDashboard } from '../data/fetch-shipments';
import { LoadFailureAlert } from '../components/LoadFailureAlert'
import { TodayShipmentsTable } from '../components/TodayShipmentTable';
import { UpcomingShipmentsTable } from '../components/UpcomingShipmentsTable';

type LoadingResult = {
  status: 'LOADING'
}

const INITIAL_RESULT: LoadingResult = {
  status: 'LOADING'
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px 16px',
    gap: '16px',

    //Wrap to two columns on tablet+
    '@media (min-width: 768px)': {
      flexDirection: 'row'
    }
  },
  todayShipmentSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: .6,

    '@media (min-width: 768px)': {
      maxWidth: '450px'
    }
  },
  upcomingShipmentSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  loader: {
    margin: 'auto',
    width: 'fit-content',
    marginTop: 200
  }
})

export const DashboardPage: React.FC = () => {
  const classes = useStyles()
  const theme = useTheme()

  const [ shipmentDayBucketsResult, setShipmentDayBucketsResult ] = useState<FetchShipmentDayBucketsResult | LoadingResult>(INITIAL_RESULT)

  const loadShipments = async () => {
    setShipmentDayBucketsResult(INITIAL_RESULT)
    const results = await fetchShipmentsForDashboard()

    setShipmentDayBucketsResult(results)
  }

  useEffect(() => {
    loadShipments()
  }, [])

  let component: ReactElement
  switch (shipmentDayBucketsResult.status) {
    case 'SUCCESS': {
      const todayBucket = shipmentDayBucketsResult.dayBuckets.find(bucket => isToday(new Date(bucket.date)))
      const remainingBuckets = shipmentDayBucketsResult.dayBuckets.filter(bucket => bucket !== todayBucket)

      component =
        <div className={classes.container}>
          <div className={classes.todayShipmentSection}>
            <h2>Today's Shipments</h2>
            <TodayShipmentsTable shipmentBucket={todayBucket} />
          </div>
          <div className={classes.upcomingShipmentSection}>
            <h2>Upcoming Shipments</h2>
            <UpcomingShipmentsTable shipmentDayBuckets={remainingBuckets} />
          </div>
        </div>
      break;
    }
    case 'LOADING': {
      component = <Box className={classes.loader}>
        <Loader type="Grid" color={theme.palette.primary.main} />
      </Box>
      break
    }
    case 'ERROR': {
      component = <LoadFailureAlert retryHandler={loadShipments} />
    }
  }

  return component
}
