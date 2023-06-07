import { Observable } from 'rxjs';
import { IWizStep } from './wiz-step.interface';

export abstract class WizStepBaseComponent implements IWizStep {

  code: string;
  icon: string;
  title: string;

  isSelected: boolean;
  isOpen: boolean;
  isComplete: boolean;
  required: boolean;
  isValid: boolean;
  isDisabled: boolean;

  abstract validate(): boolean;
  abstract complete(): Observable<any> | boolean;

}
