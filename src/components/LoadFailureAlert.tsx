import { Button, makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles({
  failure: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem'
  }
})

export type LoadFailureAlertProps = {
  retryHandler: () => void
}

export const LoadFailureAlert: React.FC<LoadFailureAlertProps> = ({ retryHandler }) => {
  const classes = useStyles()

  const retryButton =
    <Button
      endIcon={<ReplayIcon />}
      onClick={retryHandler}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          retryHandler()
        }
      }}>
      Retry
    </Button>

  return (
    <div className={classes.failure}>
      <Alert
        severity={'error'}
        action={retryButton}>
        <AlertTitle>
          <strong>Failed to load details</strong>
        </AlertTitle>
        This is likely a temporary error. Please try again later.
      </Alert>
    </div>
  )
}
