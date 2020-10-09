import React, { FC, FormEvent, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Button, Form, Segment } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'

import { Activity } from 'app/models/activity'
import ActivityStore from 'app/stores/activityStore'

interface DetailParams {
  id: string
}

const ActivityForm: FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const activityStore = useContext(ActivityStore)
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity
  } = activityStore

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  })

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(() => initialFormState && setActivity(initialFormState))
    }

    return () => {
      clearActivity()
    }
  }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length])

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      }
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
    } else {
      editActivity(activity).then(() => history.push(`/activities/${activity.id}`))
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
        <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
        <Button floated='right' type='button' content='Cancel' onClick={() => history.push('/activities')} />
      </Form>
    </Segment>
  )
}

export default observer(ActivityForm)
