import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container } from 'semantic-ui-react'

import { Activity } from 'app/models/activity'
import Navbar from 'features/nav/Navbar'
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard'

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [editMode, setEditMode] = useState(false)

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(act => act.id === id)[0])
    setEditMode(false)
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(act => act.id !== id)])
  }

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(res => {
      let activities: Activity[] = []
      res.data.forEach(act => {
        act.date = act.date.split('.')[0]
        activities.push(act)
      })
      setActivities(activities)
    })
  }, [])

  const handleCreateActivity = (activity: Activity) => {
    setActivities([...activities, activity])
    setSelectedActivity(activity)
    setEditMode(false)
  }

  const handleEditActivity = (activity: Activity) => {
    setActivities([...activities.filter(act => act.id !== activity.id), activity])
    setSelectedActivity(activity)
    setEditMode(false)
  }

  return (
    <>
      <Navbar handleOpenCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          handleSelectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          handleCreateActivity={handleCreateActivity}
          handleEditActivity={handleEditActivity}
          handleDeleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  )
}

export default App
