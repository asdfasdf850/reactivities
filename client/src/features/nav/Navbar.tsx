import React, { FC, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Container, Menu } from 'semantic-ui-react'

import ActivityStore from 'app/stores/activityStore'

const Navbar: FC = () => {
  const activityStore = useContext(ActivityStore)

  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item>
          <Button positive content='Create Activity' onClick={activityStore.openCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default observer(Navbar)
