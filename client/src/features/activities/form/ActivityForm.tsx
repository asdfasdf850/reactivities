import React, { FC, FormEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'

import { Activity } from 'app/models/activity'

interface Props {
  setEditMode: (editMode: boolean) => void
  selectedActivity: Activity
  handleCreateActivity: (activity: Activity) => void
  handleEditActivity: (activity: Activity) => void
}

const ActivityForm: FC<Props> = ({
  setEditMode,
  selectedActivity,
  handleCreateActivity,
  handleEditActivity
}) => {
  const initializeForm = () => {
    if (selectedActivity) return selectedActivity
    else
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      }
  }

  const [activity, setActivity] = useState<Activity>(initializeForm())

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      }
      handleCreateActivity(newActivity)
    } else {
      handleEditActivity(activity)
    }
  }

  const handleInputChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setActivity({ ...activity, [e.currentTarget.name]: e.currentTarget.value })
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange} />
        <Form.TextArea
          rows={2}
          placeholder='Description'
          name='description'
          value={activity.description}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='Category'
          name='category'
          value={activity.category}
          onChange={handleInputChange}
        />
        <Form.Input
          type='datetime-local'
          placeholder='Date'
          name='date'
          value={activity.date}
          onChange={handleInputChange}
        />
        <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange} />
        <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange} />
        <Button floated='right' positive type='submit' content='Submit' />
        <Button floated='right' type='button' content='Cancel' onClick={() => setEditMode(false)} />
      </Form>
    </Segment>
  )
}

export default ActivityForm
