import { action, computed, observable, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'

import { Activity } from 'app/models/activity'
import agent from 'app/api/agent'

configure({ enforceActions: 'always' })

class ActivityStore {
  @observable activityRegistry = new Map()
  @observable activity: Activity | null = null
  @observable loadingInitial = false
  @observable submitting = false
  @observable target = ''

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
  }

  groupActivitiesByDate = (activities: Activity[]) => {
    const sortedActivities = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split('T')[0]
        activities[date] = activities[date] ? [...activities[date], activity] : [activity]
        return activities
      }, {} as Record<string, Activity[]>)
    )
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

  @action loadActivity = async (id: string) => {
    let activity = this.activityRegistry.get(id)
    if (activity) {
      this.activity = activity
    } else {
      this.loadingInitial = true
      try {
        activity = await agent.Activities.details(id)
        runInAction('loadActivity', () => {
          this.activity = activity
          this.loadingInitial = false
        })
      } catch (error) {
        runInAction('loadActivityError', () => {
          this.loadingInitial = false
        })
        console.error(error)
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null
  }

  @action createActivity = async (activity: Activity) => {
    this.submitting = true
    try {
      await agent.Activities.create(activity)
      runInAction('createActivity', () => {
        this.activityRegistry.set(activity.id, activity)
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
        this.activity = activity
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
}

export default createContext(new ActivityStore())
