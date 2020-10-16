import { action, computed, observable, runInAction } from 'mobx'
import { toast } from 'react-toastify'
import { SyntheticEvent } from 'react'

import { IActivity } from 'app/models/activity'
import agent from 'app/api/agent'
import { history } from '../../'
import { RootStore } from './rootStore'

export default class ActivityStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @observable activityRegistry = new Map()
  @observable activity: IActivity | null = null
  @observable loadingInitial = false
  @observable submitting = false
  @observable target = ''

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
  }

  groupActivitiesByDate = (activities: IActivity[]) => {
    const sortedActivities = activities.sort((a, b) => a.date.getTime() - b.date.getTime())
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0]
        activities[date] = activities[date] ? [...activities[date], activity] : [activity]
        return activities
      }, {} as Record<string, IActivity[]>)
    )
  }

  @action loadActivities = async () => {
    this.loadingInitial = true
    try {
      const activities = await agent.Activities.list()
      runInAction('loadActivities', () => {
        activities.forEach(act => {
          act.date = new Date(act.date)
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
      return activity
    } else {
      this.loadingInitial = true
      try {
        activity = await agent.Activities.details(id)
        runInAction('loadActivity', () => {
          activity.date = new Date(activity.date)
          this.activity = activity
          this.activityRegistry.set(activity.id, activity)
          this.loadingInitial = false
        })
        return activity
      } catch (error) {
        runInAction('loadActivityError', () => {
          this.loadingInitial = false
        })
        console.error(error)
      }
    }
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true
    try {
      await agent.Activities.create(activity)
      runInAction('createActivity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.submitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('createActivityError', () => {
        this.submitting = false
      })
      toast.error('Problem submitting data')
      console.error(error.response)
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true
    try {
      await agent.Activities.update(activity)
      runInAction('editActivity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.activity = activity
        this.submitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('editActivityError', () => {
        this.submitting = false
      })
      toast.error('Problem submitting data')
      console.error(error.response)
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

  @action clearActivity = () => {
    this.activity = null
  }
}
