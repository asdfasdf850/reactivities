import React, { FC, Fragment, useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { format } from 'date-fns'

import ActivityListItem from './ActivityListItem'
import { RootStoreContext } from 'app/stores/rootStore'

const ActivityList: FC = () => {
  const rootStore = useContext(RootStoreContext)
  const { activitiesByDate } = rootStore.activityStore

  return (
    <>
      {activitiesByDate.map(([date, activities]) => (
        <Fragment key={date}>
          <Label size='large' color='blue'>
            {format(new Date(date), 'eeee do MMMM')}
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
