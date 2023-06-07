import { Observable } from 'rxjs';

export interface IUploader {
  afterUpload: Observable<any>;
  upload(file: File, path?: string, query?: any): Observable<any>;
}
