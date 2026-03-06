export interface InvitationTag {
  label: string;
  backgroundColor: string;
  textColor: string;
}

export interface Invitation {
  id: string;
  inviteId?: string | null;
  message: string;
  timestamp: string;
  organiserName: string;
  organiserAvatarColor: string;
  organiserIcon: string;
  eventName: string;
  eventImage: string;
  tags: InvitationTag[];
  dateTime: string;
  location: string;
}
