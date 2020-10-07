import React, { FC } from 'react'
import { Grid } from 'semantic-ui-react'

import { Activity } from 'app/models/activity'
import ActivityList from './ActivityList'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'

interface Props {
  activities: Activity[]
  handleSelectActivity: (id: string) => void
  selectedActivity: Activity
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  setSelectedActivity: (activity: Activity | null) => void
  handleCreateActivity: (activity: Activity) => void
  handleEditActivity: (activity: Activity) => void
  handleDeleteActivity: (id: string) => void
}

const ActivityDashboard: FC<Props> = ({
  activities,
  handleSelectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  handleCreateActivity,
  handleEditActivity,
  handleDeleteActivity
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          handleSelectActivity={handleSelectActivity}
          handleDeleteActivity={handleDeleteActivity}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            selectedActivity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm
            key={selectedActivity?.id || 0}
            setEditMode={setEditMode}
            selectedActivity={selectedActivity!}
            handleCreateActivity={handleCreateActivity}
            handleEditActivity={handleEditActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  )
}

export default ActivityDashboard
