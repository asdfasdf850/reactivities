import React, { FC, useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'

import ActivityList from './ActivityList'
import ActivityStore from 'app/stores/activityStore'
import LoadingComponent from 'app/layout/LoadingComponent'

const ActivityDashboard: FC = () => {
  const activityStore = useContext(ActivityStore)
  const { loadActivities, loadingInitial, activityRegistry } = activityStore

  useEffect(() => {
    if (activityRegistry.size > 0) return

    loadActivities()
  }, [loadActivities, activityRegistry.size])

  if (loadingInitial) return <LoadingComponent content='Loading activities...' />

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)
