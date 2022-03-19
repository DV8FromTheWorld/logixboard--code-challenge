import { ReactElement, useEffect, useState } from 'react'
import Loader                                from 'react-loader-spinner'
import { Box, makeStyles, useTheme }         from '@material-ui/core'
import { DataGrid, GridColDef }              from '@material-ui/data-grid'

import { LoadFailureAlert } from "../components/LoadFailureAlert";
import { fetchShipments, FetchShipmentsResult } from '../data/fetch-shipments'

const COLUMNS: GridColDef[] = [
    {
        field: 'houseBillNumber',
        headerName: 'House Bill',
        width: 150
    },
    {
        field: 'client',
        headerName: 'Shipper',
        width: 200
    },
    {
        field: 'origin',
        headerName: 'Origin',
        width: 400
    },
    {
        field: 'destination',
        headerName: 'Destination',
        width: 400
    },
    {
        field: 'mode',
        headerName: 'Mode',
        width: 200
    },
    {
        field: 'estimatedDeparture',
        headerName: 'Estimated Departure',
        width: 200
    },
    {
        field: 'estimatedArrival',
        headerName: 'Estimated Arrival',
        width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 200
    }
]

const useStyles = makeStyles({
    shipmentTable: {
        marginInline: 16,
    },
    loader: {
        margin: 'auto',
        width: 'fit-content',
        marginTop: 200
    },
})

type LoadingResult = {
    status: 'LOADING'
}
const INITIAL_RESULT: LoadingResult = {
    status: 'LOADING'
}

export const ShipmentsPage: React.FC = () => {
    const classes = useStyles()
    const theme = useTheme()

    const [fetchShipmentsResult, setFetchShipmentsResult] = useState<FetchShipmentsResult | LoadingResult>(INITIAL_RESULT)

    const loadShipments = () => {
        setFetchShipmentsResult(INITIAL_RESULT)
        fetchShipments().then(result => setFetchShipmentsResult(result))
    }

    useEffect(() => {
        loadShipments()
    }, [])

    let component: ReactElement
    switch (fetchShipmentsResult.status) {
        case 'SUCCESS': {
            component = <DataGrid
                className={classes.shipmentTable}
                rows={fetchShipmentsResult.shipments}
                autoPageSize={true}
                columns={COLUMNS}
                disableSelectionOnClick
            />
            break;
        }
        case 'LOADING': {
            component = <Box className={classes.loader}>
                <Loader type="Grid" color={theme.palette.primary.main}/>
            </Box>
            break
        }
        case 'ERROR': {
            component = <LoadFailureAlert retryHandler={loadShipments}/>
        }
    }

    return component
}
