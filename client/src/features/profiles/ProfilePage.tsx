import React, { FC, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'

import LoadingComponent from 'app/layout/LoadingComponent'
import { RootStoreContext } from 'app/stores/rootStore'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

interface RouteParams {
  username: string
}

interface Props extends RouteComponentProps<RouteParams> {}

const ProfilePage: FC<Props> = ({ match }) => {
  const rootStore = useContext(RootStoreContext)
  const { profile, loadingProfile, loadProfile } = rootStore.profileStore

  useEffect(() => {
    loadProfile(match.params.username)
  }, [loadProfile, match.params.username])

  if (loadingProfile) return <LoadingComponent content='Loading profile...' />

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ProfilePage)
