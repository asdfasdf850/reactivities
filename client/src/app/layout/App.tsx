import React, { useContext, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { Route, Switch, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { RootStoreContext } from 'app/stores/rootStore'
import Navbar from 'features/nav/Navbar'
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard'
import HomePage from 'features/home/HomePage'
import ActivityForm from 'features/activities/form/ActivityForm'
import ActivityDetails from 'features/activities/details/ActivityDetails'
import NotFound from './NotFound'
import LoadingComponent from './LoadingComponent'
import ModalContainer from 'app/common/modals/ModalContainer'
import ProfilePage from 'features/profiles/ProfilePage'

function App() {
  const location = useLocation()
  const rootStore = useContext(RootStoreContext)
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore
  const { getUser } = rootStore.userStore

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded()
    }
  }, [token, getUser, setAppLoaded])

  if (!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route
                  path={['/createActivity', '/manage/:id']}
                  component={ActivityForm}
                  key={location.key}
                />
                <Route path='/profile/:username' component={ProfilePage} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  )
}

export default observer(App)
