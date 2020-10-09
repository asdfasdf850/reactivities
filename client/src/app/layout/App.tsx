import React from 'react'
import { Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { Route, useLocation } from 'react-router-dom'

import Navbar from 'features/nav/Navbar'
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard'
import HomePage from 'features/home/HomePage'
import ActivityForm from 'features/activities/form/ActivityForm'
import ActivityDetails from 'features/activities/details/ActivityDetails'

function App() {
  const location = useLocation()

  return (
    <>
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route path={['/createActivity', '/manage/:id']} component={ActivityForm} key={location.key} />
            </Container>
          </>
        )}
      />
    </>
  )
}

export default observer(App)
