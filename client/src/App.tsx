import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Header, Icon, List } from 'semantic-ui-react'

function App() {
  const [values, setValues] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/values').then(res => {
      setValues(res.data)
    })
  }, [])

  return (
    <>
      <Header>
        <Icon name='users' />
        <Header.Content>Reactivities</Header.Content>
      </Header>
      <List>
        {values.map(value => (
          <List.Item key={value.id}>{value.name}</List.Item>
        ))}
      </List>
    </>
  )
}

export default App
