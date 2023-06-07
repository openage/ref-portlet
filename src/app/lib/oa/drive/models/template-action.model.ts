export class TemplateAction {
  label: string; // 'view'
  type: { type: string }; // 'button' input methods
  operation: string; // 'httpGET,POST' 'intent',
  data: { // to inject part
    body: any,
    url: string,
    headers: any
  };
  await: boolean; // to wait for response
}
