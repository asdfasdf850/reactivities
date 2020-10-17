import { action, computed, observable, runInAction } from 'mobx'
import { toast } from 'react-toastify'
import { SyntheticEvent } from 'react'

import { IActivity } from 'app/models/activity'
import agent from 'app/api/agent'
import { history } from '../../'
import { RootStore } from './rootStore'
import { createAttendee, setActivityProps } from 'app/common/util/util'

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
  @observable loading = false

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
        activities.forEach(activity => {
          setActivityProps(activity, this.rootStore.userStore.user!)
          this.activityRegistry.set(activity.id, activity)
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
          setActivityProps(activity, this.rootStore.userStore.user!)
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
      const attendee = createAttendee(this.rootStore.userStore.user!)
      attendee.isHost = true
      let attendees = []
      attendees.push(attendee)
      activity.attendees = attendees
      activity.isHost = true
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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!)
    this.loading = true
    try {
      await agent.Activities.attend(this.activity!.id)
      runInAction('attendActivity', () => {
        if (this.activity) {
          this.activity.attendees.push(attendee)
          this.activity.isGoing = true
          this.activityRegistry.set(this.activity.id, this.activity)
          this.loading = false
        }
      })
    } catch (error) {
      runInAction('attendActivityError', () => {
        this.loading = false
      })
      toast.error('Problem signing up to activity')
      console.error(error)
    }
  }

  @action cancelAttendance = async () => {
    this.loading = true
    try {
      await agent.Activities.unattend(this.activity!.id)
      runInAction('cancelAttendance', () => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          )
          this.activity.isGoing = false
          this.activityRegistry.set(this.activity.id, this.activity)
        }
        this.loading = false
      })
    } catch (error) {
      runInAction('cancelAttendanceError', () => {
        this.loading = false
      })
      toast.error('Problem cancelling attendance')
      console.error(error)
    }
  }

  @action clearActivity = () => {
    this.activity = null
  }
}
