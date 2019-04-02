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
   uploadFile(url: string, file: File): Observable<HttpEvent<any>> {

     let formData = new FormData();
     formData.append('file', file);

     let params = new HttpParams();

     const options = {
       params: params,
       reportProgress: true,
     };

     const req = new HttpRequest('POST', url, formData, options);
     return this.http.request(req);
   }

   downloadFile(fileName: string){
     const url = environment.prodApiUrl +'/file-upload-service/files/'+ fileName;
     console.log(url);
     //return this.http.get(url);
     return url;
   }
}
