export class GeoLocation {
  name: string;
  description: string;
  coordinates: number[];

  constructor(obj?: any) {
    if (!obj) { return; }
    this.name = obj.name;
    this.description = obj.description;
    this.coordinates = obj.coordinates || [];
  }
}
