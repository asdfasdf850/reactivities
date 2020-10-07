import React, { FC, SyntheticEvent } from 'react'
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
  handleDeleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void
  submitting: boolean
  target: string
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
  handleDeleteActivity,
  submitting,
  target
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          handleSelectActivity={handleSelectActivity}
          handleDeleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
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
            submitting={submitting}
          />
        )}
      </Grid.Column>
    </Grid>
  )
}

export default ActivityDashboard
