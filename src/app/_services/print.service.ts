import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  				+ Object.keys(params).map(a=>a+'='+params[a]).join('&')
  				+'_blank';
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