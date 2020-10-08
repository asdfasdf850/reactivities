import { action, computed, observable, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'

import { Activity } from 'app/models/activity'
import agent from 'app/api/agent'

configure({ enforceActions: 'always' })

class ActivityStore {
  @observable activityRegistry = new Map()
  @observable activities: Activity[] = []
  @observable selectedActivity: Activity | undefined
  @observable loadingInitial = false
  @observable editMode = false
  @observable submitting = false
  @observable target = ''

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
  }

  @action loadActivities = async () => {
    this.loadingInitial = true
    try {
      const activities = await agent.Activities.list()
      runInAction('loadActivities', () => {
        activities.forEach(act => {
          act.date = act.date.split('.')[0]
          this.activityRegistry.set(act.id, act)
        })
        this.loadingInitial = false
      })
    } catch (error) {
      runInAction('loadActivitiesError', () => {
        this.loadingInitial = false
      })
      console.error(error)
    }
  }

  @action createActivity = async (activity: Activity) => {
    this.submitting = true
    try {
      await agent.Activities.create(activity)
      runInAction('createActivity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.editMode = false
        this.submitting = false
      })
    } catch (error) {
      runInAction('createActivityError', () => {
        this.submitting = false
      })
      console.error(error)
    }
  }

  @action editActivity = async (activity: Activity) => {
    this.submitting = true
    try {
      await agent.Activities.update(activity)
      runInAction('editActivity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity
        this.editMode = false
        this.submitting = false
      })
    } catch (error) {
      runInAction('editActivityError', () => {
        this.submitting = false
      })
      console.error(error)
    }
  }

  @action deleteActivity = async (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true
    this.target = e.currentTarget.name
    try {
      await agent.Activities.delete(id)
      runInAction('deleteActivity', () => {
        this.activityRegistry.delete(id)
        this.submitting = false
        this.target = ''
      })
    } catch (error) {
      runInAction('deleteActivityError', () => {
        this.submitting = false
        this.target = ''
      })
      console.error(error)
    }
  }

  @action openCreateForm = () => {
    this.editMode = true
    this.selectedActivity = undefined
  }

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
    this.editMode = true
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined
  }

  @action cancelFormOpen = () => {
    this.editMode = false
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
    this.editMode = false
  }
}

export default createContext(new ActivityStore())
