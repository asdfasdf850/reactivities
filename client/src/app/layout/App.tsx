import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'

import { Activity } from 'app/models/activity'
import Navbar from 'features/nav/Navbar'
import agent from 'app/api/agent'
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard'
import LoadingComponent from './LoadingComponent'

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [target, setTarget] = useState('')

  useEffect(() => {
    agent.Activities.list()
      .then(res => {
        let activities: Activity[] = []
        res.forEach(act => {
          act.date = act.date.split('.')[0]
          activities.push(act)
        })
        setActivities(activities)
      })
      .then(() => setLoading(false))
  }, [])

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(act => act.id === id)[0])
    setEditMode(false)
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const handleCreateActivity = (activity: Activity) => {
    setSubmitting(true)
    agent.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity)
        setEditMode(false)
      })
      .then(() => setSubmitting(false))
  }

  const handleEditActivity = (activity: Activity) => {
    setSubmitting(true)
    agent.Activities.update(activity)
      .then(() => {
        setActivities([...activities.filter(act => act.id !== activity.id), activity])
        setSelectedActivity(activity)
        setEditMode(false)
      })
      .then(() => setSubmitting(false))
  }

  const handleDeleteActivity = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true)
    setTarget(e.currentTarget.name)
    agent.Activities.delete(id)
      .then(() => {
        setActivities([...activities.filter(act => act.id !== id)])
      })
      .then(() => setSubmitting(false))
  }

  if (loading) return <LoadingComponent content='Loading activities...' />

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
          submitting={submitting}
          target={target}
        />
      </Container>
    </>
  )
}

export default App
