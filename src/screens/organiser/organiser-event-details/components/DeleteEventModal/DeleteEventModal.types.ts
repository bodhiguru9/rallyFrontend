export interface DeleteEventModalProps {
  visible: boolean;
  onClose: () => void;
  /** Event ID to delete when user confirms. */
  eventId: string | null;
  /** Called after delete event API succeeds. */
  onDeleteSuccess?: () => void;
}
