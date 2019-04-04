import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralInfoComponent } from '@app/quotation/general-info/general-info.component';
import { environment } from '@environments/environment';
import { QuotationService } from '@app/_services';


@Component({
	selector: 'app-quotation',
	templateUrl: './quotation.component.html',
	styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
	constructor(private route: ActivatedRoute,private modalService: NgbModal, private titleService: Title, private router: Router, private quotationService: QuotationService) { }
	docTitle: string = "";
	sub: any;
	line: string;
	selectedReport: string;
	printType: string;
	reportsList: any[] = [
								/*{val:"QUOTER009A", desc:"Quotation Letter" },
								{val:"QUOTER009B", desc:"RI Preparedness to Support Letter and RI Confirmation of Acceptance Letter" },
								{val:"QUOTER009C", desc:"Risk Not Commensurate" },
								{val:"QUOTER009D", desc:"Treaty Exclusion Letter" },
								{val:"QUOTER007", desc:"Advice on Internal Competition" },*/
					     ]

	quoteInfo = {
		quoteId: '',
		quotationNo: '',
		riskName: '',
		insuredDesc: '',
		riskId: '',
		currencyCd: '',
		currencyRt: '',
		typeOfCession: '',
		status:'',
		reasonCd:'',
		lineCd: '',
		showAlop:false
	}

	inquiryFlag: boolean = false;
	header: string;
	showAlop:boolean = false;
	enblEndtTab:boolean = false;
	dialogIcon:string  = "";
  dialogMessage:string  = "";
  btnDisabled: boolean;
  defaultType:boolean = true;
  status: any;
  cessionDesc: any;
  quoteId: any;

  passData: any = {
    cessionDesc: null,
    status: null,
    quoteId: null
  }

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
            this.inquiryFlag = params['inquiry'];
        });
	}

	showApprovalModal(content) {
	    this.printType = "SCREEN";
		if(this.isEmptyObject(this.selectedReport)){
    		this.selectedReport = null;
    		this.btnDisabled = true;
    	} else {
    		this.btnDisabled = false;
    	};
		this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
	}

	onTabChange($event: NgbTabChangeEvent) {
		 // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
		 // 	  $event.preventDefault();
   //   }

  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 

  		if ($event.nextId === 'approval-tab') {
			$event.preventDefault();
		}

      if ($event.nextId === 'Print') {
        $event.preventDefault();
        $('#printListQuotation > #printModalBtn').trigger('click');
      } 


 
  	}

  checkQuoteInfo(event){  		
  		this.quoteInfo = event;
      this.passData.cessionDesc = this.quoteInfo.typeOfCession.toUpperCase()
      this.passData.status = this.quoteInfo.status;
      this.passData.quoteId = this.quoteInfo.quoteId;
      this.passData.reasonCd = this.quoteInfo.reasonCd;
    
  		setTimeout(() => { this.header = "/ " + (this.quoteInfo.quotationNo == '' ? this.quoteInfo.lineCd : this.quoteInfo.quotationNo) }, 0);

  	if(this.quoteInfo.typeOfCession.toUpperCase() == 'RETROCESSION'){
  			/*this.reportsList.push({val:"QUOTER009B", desc:"RI Preparedness to Support Letter and RI Confirmation of Acceptance Letter" })*/
  			this.reportsList.push({val:"QUOTER009B", desc:"RI Preparedness to Support Letter" },
  								  {val:"QUOTER009B", desc:"RI Confirmation of Acceptance Letter" });
 
  		}
		if(this.quoteInfo.status == '10'){
			this.reportsList.push({val:"QUOTER009C", desc:"Risk Not Commensurate" });
		}
		if(this.quoteInfo.status == '9' && this.quoteInfo.reasonCd == 'NT'){
			this.reportsList.push({val:"QUOTER009D", desc:"Treaty Exclusion Letter"});
		}
		if (this.quoteInfo.typeOfCession.toUpperCase() == 'DIRECT'){
			this.reportsList.push({val:"QUOTER009A", desc:"Quotation Letter" });
		}
  	}

  	showPrintPreview(content) {
         	if (this.printType.toUpperCase() == 'SCREEN'){
  			window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + this.selectedReport + '&quoteId=' + this.quoteInfo.quoteId, '_blank');
	  		this.modalService.dismissAll();
	  		} else if (this.printType.toUpperCase() == 'PDF'){
	  			this.downloadPDF(this.selectedReport,this.quoteInfo.quoteId);
	  	    	this.modalService.dismissAll();
	  		} else if (this.printType.toUpperCase() == 'PRINTER'){
	  			this.printPDF(this.selectedReport,this.quoteInfo.quoteId);
	  		    this.modalService.dismissAll();
	  		}
  	}

  	downloadPDF(reportName : string, quoteId : string){
       var fileName = this.quoteInfo.quotationNo;
       this.quotationService.downloadPDF(reportName,quoteId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = fileName;
              link.click();
       },
       error => {
            if (this.isEmptyObject(error)) {
            } else {
               this.dialogIcon = "error-message";
               this.dialogMessage = "Error generating PDF file";
               $('#quotation #successModalBtn').trigger('click');
               setTimeout(()=>{$('.globalLoading').css('display','none');},0);
            }          
       });
    }

    printPDF(reportName : string, quoteId : string){
       var fileName = this.quoteInfo.quotationNo;
       this.quotationService.downloadPDF(reportName,quoteId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = downloadURL;
              document.body.appendChild(iframe);
              iframe.contentWindow.print();
       },
        error => {
            if (this.isEmptyObject(error)) {
            } else {
               this.dialogIcon = "error-message";
               this.dialogMessage = "Error printing file";
               $('#quotation #successModalBtn').trigger('click');
               setTimeout(()=>{$('.globalLoading').css('display','none');},0);
            }          
       });
    }



    isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

    tabController(event){
       this.btnDisabled = false;
    }

    cancel(){
    	if(this.isEmptyObject(this.selectedReport)){
    		this.selectedReport = null;
    		this.btnDisabled = true;
    	} else {
    		this.btnDisabled = false;
    	};
    }

    

	// setDocumentTitle(event) {
	// 	console.log(event.target.closest('div').innerText);
	// 	this.docTitle = event.target.innerText;
	// 	if (this.docTitle == "General Info") {
	// 		this.titleService.setTitle("Quo | General Info");
	// 	} else if (this.docTitle == "Coverage") {
	// 		this.titleService.setTitle("Quo | Coverage");
	// 	} else if (this.docTitle == "Quote Option") {
	// 		this.titleService.setTitle("Quo | Quote Option");
	// 	} else if (this.docTitle == "Endorsement") {
	// 		this.titleService.setTitle("Quo | Endorsement");
	// 	} else if (this.docTitle == "ALOP") {
	// 		this.titleService.setTitle("Quo | ALOP");
	// 	} else if (this.docTitle == "Internal Competition") {
	// 		this.titleService.setTitle("Quo | Internal Competition");
	// 	} else if (this.docTitle == "Attachment") {
	// 		this.titleService.setTitle("Quo | Attachment");
	// 	}
	// }

}
