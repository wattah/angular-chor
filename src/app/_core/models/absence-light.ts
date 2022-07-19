export interface AbsenceLight {
  id: number;
  beginDate: Date;
  endDate: Date;
  userId: number;
  userName: string;
  backupId: number;
  backupName: string;
  status: string;
  comment: string;
  backupMail: string;
  beginDateFormatted: string;
  endDateFormatted: string;
  backupFirstName: string;
	backupLastName: string;
}
