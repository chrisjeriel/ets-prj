import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

 constructor(private http: HttpClient) { }

   // file from event.target.files[0]
   uploadFile(file: File, date?: any, module?: string, refId?: string): Observable<HttpEvent<any>> {

     let url = environment.prodApiUrl + "/file-upload-service/";

     let formData = new FormData();
     //formData.append('file', file, date+file.name);
     formData.append('file', file, file.name);

     let params = new HttpParams();

     const options = {
       params: params,
       reportProgress: true,
     };

     const req = new HttpRequest('POST', url+'?module='+module+'&refId='+refId, formData, options);
     return this.http.request(req);
   }

   uploadFileToDB(file: File, date?: any, module?: string, refId?: string, tableName?: string): Observable<HttpEvent<any>> {

     let url = environment.prodApiUrl + "/file-upload-service/uploadFileToDB";

     let formData = new FormData();
     //formData.append('file', file, date+file.name);
     formData.append('file', file, file.name);

     let params = new HttpParams();

     const options = {
       params: params,
       reportProgress: true,
     };

     const req = new HttpRequest('POST', url+'?module='+module+'&refId='+refId+'&tableName='+tableName, formData, options);
     return this.http.request(req);
   }

   downloadFile(fileName: string, module?: string, refId?: string){
     const url = environment.prodApiUrl +'/file-upload-service/files/'+ fileName+'?module='+module+'&refId='+refId;
     console.log(url);
     //return this.http.get(url);
     return url;
   }

   deleteFile(fileName, module?: string, refId?: string){
     return this.http.delete(environment.prodApiUrl +'/file-upload-service/?fileNames='+fileName+'&module='+module+'&refId='+refId);
   }
}
