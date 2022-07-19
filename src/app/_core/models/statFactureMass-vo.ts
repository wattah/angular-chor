 
 export interface StatFactureMassResponseVO{

 /** Type de livrable. */
  nbFacturesAttendues: number;
 /** Factures absentes. */
  nbFacturesAbsentes : number;
 /** Factures en attentes. */
  nbFacturesEnAttente : number;
 /** Factures presentes. */
  nbFacturesPresentes: number;
 /** Factures extraites Recurrentes. */
  nbFacturesExtraitesRecurrentes: number;
 /** Factures extraites non Recurrentes. */
  nbFacturesExtraitesNonRecurrentes: number;
 /** Factures en erreur. */
  nbFacturesEnErreur: number;
 /** Factures rellokees auto Recurrentes. */
 nbFacturesRelookeesAutoRecurrentes: number;
 /** Factures rellokees auto non Recurrentes. */
  nbFacturesRelookeesAutoNonRecurrentes: number;
 /** Factures rellokees manuelle Recurrentes. */
 nbFacturesRelookeesManuelRecurrentes: number;
 /** Factures rellokees manuelle non Recurrentes. */
  nbFacturesRelookeesManuelNonRecurrentes: number;
  /** univers */
  univers : string;

}
