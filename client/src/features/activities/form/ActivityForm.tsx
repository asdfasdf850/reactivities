import React, { FC, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form'
import { v4 as uuid } from 'uuid'
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate'

import { ActivityFormValues } from 'app/models/activity'
import TextInput from 'app/common/form/TextInput'
import TextAreaInput from 'app/common/form/TextAreaInput'
import SelectInput from 'app/common/form/SelectInput'
import { category } from 'app/common/options/categoryOptions'
import DateInput from 'app/common/form/DateInput'
import { combineDateAndTime } from 'app/common/util/util'
import { RootStoreContext } from 'app/stores/rootStore'

interface DetailParams {
  id: string
}

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(5)({ message: 'Description needs to be at least 5 characters' })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})

const ActivityForm: FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const rootStore = useContext(RootStoreContext)
  const { submitting, loadActivity, createActivity, editActivity } = rootStore.activityStore

  const [activity, setActivity] = useState(new ActivityFormValues())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (match.params.id) {
      setLoading(true)
      loadActivity(match.params.id)
        .then(activity => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false))
    }
  }, [loadActivity, match.params.id])

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time)
    const { date, time, ...activity } = values
    activity.date = dateAndTime
    if (!activity.id) {
      let newActivity = { ...activity, id: uuid() }
      createActivity(newActivity)
    } else {
      editActivity(activity)
    }
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field placeholder='Title' name='title' value={activity.title} component={TextInput} />
                <Field
                  name='description'
                  placeholder='Description'
                  rows={3}
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder='Category'
                  name='category'
                  options={category}
                  value={activity.category}
                  component={SelectInput}
                />
                <Form.Group widths='equal'>
                  <Field
                    component={DateInput}
                    name='date'
                    date={true}
                    placeholder='Date'
                    value={activity.date}
                  />
                  <Field
                    component={DateInput}
                    name='time'
                    time={true}
                    placeholder='Time'
                    value={activity.time}
                  />
                </Form.Group>
                <Field placeholder='City' name='city' value={activity.city} component={TextInput} />
                <Field placeholder='Venue' name='venue' value={activity.venue} component={TextInput} />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                />
                <Button
                  floated='right'
                  type='button'
                  content='Cancel'
                  disabled={loading}
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push('/activities')
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityForm)
