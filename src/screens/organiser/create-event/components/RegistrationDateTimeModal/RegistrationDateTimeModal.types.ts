export type RegistrationDateTimeStep = 'start' | 'end';

export interface RegistrationDateTimeModalProps {
  visible: boolean;
  onClose: () => void;
  /** Current step: pick start first, then end (modal reopens for end) */
  step: RegistrationDateTimeStep;
  /** Initial date when opening (e.g. existing registrationStartTime or registrationEndTime) */
  initialDate?: Date | null;
  /** For 'end' step: start datetime so end must be after it; also used as min calendar date */
  registrationStartTime?: Date | null;
  /** Event date/time – registration start/end must be between now and this. Parent should not open modal when unset. */
  eventDateTime?: Date | null;
  /** Called when user confirms start date/time; parent should save and reopen with step='end' */
  onConfirmStart: (date: Date) => void;
  /** Called when user confirms end date/time */
  onConfirmEnd: (date: Date) => void;
}
