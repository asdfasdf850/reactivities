import { action, computed, observable, runInAction } from 'mobx'
import { toast } from 'react-toastify'

import { IPhoto, IProfile } from 'app/models/profile'
import { RootStore } from './rootStore'
import agent from 'app/api/agent'

export default class ProfileStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @observable profile: IProfile | null = null
  @observable loadingProfile = true
  @observable uploadingPhoto = false
  @observable loading = false

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username
    } else {
      return false
    }
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true
    try {
      const profile = await agent.Profiles.get(username)
      runInAction('loadProfile', () => {
        this.profile = profile
        this.loadingProfile = false
      })
    } catch (error) {
      runInAction('loadProfileError', () => {
        this.loadingProfile = false
      })
      console.error(error)
    }
  }

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true
    try {
      const photo = await agent.Profiles.uploadPhoto(file)
      runInAction('uploadPhoto', () => {
        if (this.profile) {
          this.profile.photos.push(photo)
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url
            this.profile.image = photo.url
          }
        }
        this.uploadingPhoto = false
      })
    } catch (error) {
      console.error(error)
      toast.error('Problem uploading photo')
      runInAction('uploadPhoto', () => {
        this.uploadingPhoto = false
      })
    }
  }

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true
    try {
      await agent.Profiles.setMainPhoto(photo.id)
      runInAction('setMainPhoto', () => {
        this.rootStore.userStore.user!.image = photo.url
        this.profile!.photos.find(x => x.isMain)!.isMain = false
        this.profile!.photos.find(x => x.id === photo.id)!.isMain = true
        this.profile!.image = photo.url
        this.loading = false
      })
    } catch (error) {
      runInAction('setMainPhotoError', () => {
        this.loading = false
      })
      toast.error('Problem setting photo as main')
      console.error(error)
    }
  }

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true
    try {
      await agent.Profiles.delete(photo.id)
      runInAction('deletePhoto', () => {
        this.profile!.photos = this.profile!.photos.filter(x => x.id !== photo.id)
        this.loading = false
      })
    } catch (error) {
      runInAction('deletePhotoError', () => {
        this.loading = false
      })
      toast.error('Problem deleting photo')
      console.error(error)
    }
  }
}
