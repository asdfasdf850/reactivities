import React, { FC } from 'react'
import { Image, List, Popup } from 'semantic-ui-react'

import { IAttendee } from 'app/models/activity'

interface Props {
  attendees: IAttendee[]
}

const ActivityListItemAttendees: FC<Props> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map(attendee => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.displayName}
            trigger={<Image size='mini' circular src={attendee.image || '/assets/user.png'} />}
          />
        </List.Item>
      ))}
    </List>
  )
}

export default ActivityListItemAttendees
