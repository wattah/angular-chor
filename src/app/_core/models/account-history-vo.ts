import { HistoSolde50DVO } from './histo-solde50-vo';
export interface AccountHistoryVO{
	accountNumber: string;
	accountHistories: Array<HistoSolde50DVO>;
}