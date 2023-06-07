export class Slide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  isUpdating = false;
  readyToReceive = false;
  isEditing = false;

  constructor(obj?: any) {
    if (!obj) { return; }
    this.id = obj.id;
    this.imageUrl = obj.imageUrl;
    this.title = obj.title;
    this.description = obj.description;
  }
}
