import { Observable } from 'rxjs';
export interface IWizStep {
  code: string;
  icon: string;
  title: string;
  isSelected: boolean;
  isOpen: boolean;
  isComplete: boolean;
  required: boolean;
  isValid: boolean;
  isDisabled: boolean;
  validate(): Observable<any> | boolean;
  complete(): Observable<any> | boolean;
}
