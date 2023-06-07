export class IOrganization {
  id?: string | number;
  code?: string;
  name?: string;
  phone: string;
  email: string;
  status?: string;
  timeStamp?: Date;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.phone = obj.phone;
    this.email = obj.email;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
  }

}
