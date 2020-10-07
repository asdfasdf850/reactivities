import React, { FC } from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'

interface Props {
  handleOpenCreateForm: () => void
}

const Navbar: FC<Props> = ({ handleOpenCreateForm }) => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item>
          <Button positive content='Create Activity' onClick={handleOpenCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default Navbar
