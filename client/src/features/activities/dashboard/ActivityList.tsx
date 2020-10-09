import React, { FC, Fragment, useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'

import ActivityStore from 'app/stores/activityStore'
import ActivityListItem from './ActivityListItem'

const ActivityList: FC = () => {
  const activityStore = useContext(ActivityStore)
  const { activitiesByDate } = activityStore

  return (
    <>
      {activitiesByDate.map(([date, activities]) => (
        <Fragment key={date}>
          <Label size='large' color='blue'>
            {date}
          </Label>
          <Item.Group divided>
            {activities.map(activity => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </>
  )
}

export default observer(ActivityList)
