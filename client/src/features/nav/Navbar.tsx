import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Button, Container, Menu } from 'semantic-ui-react'

const Navbar: FC = () => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as={NavLink} to='/' exact header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} exact to='/activities' />
        <Menu.Item as={NavLink} to='/createActivity'>
          <Button positive content='Create Activity' />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default observer(Navbar)
