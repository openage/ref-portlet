export interface IInputValidator {
  email: RegExp;
  mobile: RegExp;
  isEmailValid: (value: string) => any;
  isMobileValid: (value: string | number) => any;

  isCodeValid: (value: string) => any;

  isUserCodeValid: (value: string) => any;
  isOrganizationCodeValid: (value: string) => any;
  isTenantCodeValid: (value: string) => any;

  isPasswordValid: (value: string) => any;

  isGSTValid: (value: string) => any;

  isPANValid: (value: string) => any;

  isNameValid: (value: string) => any;

  isBssidValid: (value: string) => any;

  isIpAddressValid: (value: string) => any;
}
