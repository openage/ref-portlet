export class UserInput<TModel> {
  value: TModel;
  isProcessing = false;
  isDirty = false;
  error: string;
}
