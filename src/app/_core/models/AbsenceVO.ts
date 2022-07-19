import { EntityBase } from './entity-base';
export interface AbsenceVO extends EntityBase {
  /** The id. */
  id: number;

  /** The begin date. */
  beginDate: Date;

  beginDateStr: string;

  /** The end date. */
  endDate: Date;

  endDateStr: string;

  /** The user id. */
  userId: number;

  /** The user name. */
  userName: string;

  /** The backup id. */
  backupId: number;

  /** The backup name. */
  backupName: string;

  /** The status. */
  status: string;

  /** The comment. */
  comment: string;

  /** The backup mail. */
  backupMail: string;

  /** The role. */
  role: string;

/** The universal id. */
  ftUniversalId: string;

/** The page. */
  page: number;

/** The page size. */
  pageSize: number;

/** The sort field. */
  sortField: string;
  
  /** The sort order. */
  sortOrder: string;

  beginDateFormatted: string;
  endDateFormatted: string;
}
