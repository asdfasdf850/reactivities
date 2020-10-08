import React, { useContext, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'

import ActivityStore from 'app/stores/activityStore'
import Navbar from 'features/nav/Navbar'
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard'
import LoadingComponent from './LoadingComponent'

function App() {
  const activityStore = useContext(ActivityStore)

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore])

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </>
  )
}

export default observer(App)
