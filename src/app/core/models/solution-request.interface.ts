import { JournalResponse } from './journal-response.interface';
import { RecoveryDetailsResponse } from './recovery-details-response.interface';
import { SolutionDetailsResponse } from './solution-details-response.interface';
import { ConfiscationDetailsResponse, SequesterDetailsResponse } from './solution-response.interface';

export interface SolutionRequest {
  stageId: number;
  decisionId: number;
  institutionId: number;
  decisionDate: string;
  decisionNumber: string;
  confiscationDetails: ConfiscationDetailsResponse;
  sequesterDetails: SequesterDetailsResponse;
  recoveryDetails: RecoveryDetailsResponse;
  solutionDetails: SolutionDetailsResponse;
  journal: JournalResponse;
}
