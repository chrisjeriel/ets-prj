import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';
import { NotesReminders } from '@app/_models';
import { FormGroup } from '@angular/forms';
import { NotesService } from './notes.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor(private http: HttpClient, private ns: NotesService) {

  }
    /*
      PARAMETERS or refer to GenerateReportRequest.java
        String reportName
        String reportId
        POLR044 polr044Params
        Integer quoteId
        Integer adviceNo
        Integer holdCovId
        String userId
        Integer tranId
        Integer reqId
        String cedingId
        String policyId
        fileName

      DESTINATION
        screen
        dlPdf
        printPdf


    */


    extractReport(params) {
        let header: any = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        return this.http.post(environment.prodApiUrl + '/util-service/extractReport',params,header);
    }

  	print(destination:string,reportName:string,param:any){
  		let params= {...{reportName:reportName},...param};
      console.log(destination)
  		switch (destination) {
  			case "screen":
  				this.printToScreen(params);
  				break;
  			case "dlPdf":
  				this.downloadPDF(params);
  				break;
  			case "printPdf":
  				this.printPDF(params);
  				break;
  			default:
  				break;
  		}
  	}


  	printToScreen(params:any){
  		let url = environment.prodApiUrl + '/util-service/generateReport?'
  				+ Object.keys(params).map(a=>a+'='+params[a]).join('&');
  		window.open(url);
  	}

  	downloadPDF(params:any){
        this.http.get(environment.prodApiUrl + '/util-service/generateReport',{ params:params,'responseType': 'blob'}).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = params.fileName;
              link.click();
       },
       error => {
            if (false) {
            } else {
               // this.dialogIcon = "error-message";
               // this.dialogMessage = "Error generating PDF file";
               // $('#quotation #successModalBtn').trigger('click');
               // setTimeout(()=>{$('.globalLoading').css('display','none');},0);
               alert("Error generating PDF file");
            }        
       });;
    }

    printPDF(params:any){
      this.http.get(environment.prodApiUrl + '/util-service/generateReport',{ params:params,'responseType': 'blob'}).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = downloadURL;
              document.body.appendChild(iframe);
              iframe.contentWindow.print();
       },
       error => {
            if (false) {
            } else {
               // this.dialogIcon = "error-message";
               // this.dialogMessage = "Error generating PDF file";
               // $('#quotation #successModalBtn').trigger('click');
               // setTimeout(()=>{$('.globalLoading').css('display','none');},0);
               alert("Error generating PDF file");
            }        
       });;
    }
}