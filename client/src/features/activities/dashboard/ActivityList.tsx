import React, { FC, SyntheticEvent } from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react'

import { Activity } from 'app/models/activity'

interface Props {
  activities: Activity[]
  handleSelectActivity: (id: string) => void
  handleDeleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void
  submitting: boolean
  target: string
}

const ActivityList: FC<Props> = ({
  activities,
  handleSelectActivity,
  handleDeleteActivity,
  submitting,
  target
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header>{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  floated='right'
                  content='View'
                  color='blue'
                  onClick={() => handleSelectActivity(activity.id)}
                />
                <Button
                  name={activity.id}
                  floated='right'
                  content='Delete'
                  color='red'
                  onClick={e => handleDeleteActivity(e, activity.id)}
                  loading={target === activity.id && submitting}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  )
}

export default ActivityList
