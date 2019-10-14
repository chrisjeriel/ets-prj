import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralInfoComponent } from '@app/quotation/general-info/general-info.component';
import { environment } from '@environments/environment';
import { QuotationService, UserService } from '@app/_services';
import { first } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';



@Component({
	selector: 'app-quotation',
	templateUrl: './quotation.component.html',
	styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
	constructor(private route: ActivatedRoute, public modalService: NgbModal, private titleService: Title, private router: Router, private quotationService: QuotationService, private userService: UserService) { 
  }
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('tabset') tabset: NgbTabset;
  @ViewChild(GeneralInfoComponent) genInfoComponent: GeneralInfoComponent;
  @ViewChild('content') content:any;
  @ViewChild('active')activeComp:any;
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
    statusDesc: '',
		reasonCd:'',
		lineCd: '',
		showAlop:false
	}

	inquiryFlag: boolean = false;
	header: string;
	showAlop:boolean = false;
	enblEndtTab:boolean = false;
  enblOptTab:boolean = false;
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
  approveText: string = "For Approval";
  currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
  approverList: any[];
  approver:string = '';
  exitLink:string;
  accessibleModules:string [] = [];

	ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
          this.line = params['line'];
          this.inquiryFlag = params['inquiry'];
          console.log("params['inquiry'] " + params['inquiry']);
          console.log("QUOTATION COMPONENT: " + JSON.stringify(params));
          this.exitLink = params['exitLink'];
          this.accessibleModules = this.userService.getAccessModules();
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

    this.quotationService.retrieveQuoteApprover(this.quoteInfo.quoteId)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(JSON.stringify(data));
                    this.approverList = data["approverList"];
                    console.log(this.approverList)
                    this.approveText = 'For Approval';
                    for (var i = data["approverList"].length - 1; i >= 0; i--) {
                      if (data["approverList"][i].userId == this.currentUserId) {
                        this.approveText = 'Approved';
                        this.approver = this.currentUserId;
                      }
                    }

                },
                error => {
                    console.log("ERROR:::" + JSON.stringify(error));
                });

	}

  validateApproval(){
    this.approveText = 'For Approval'
    console.log(this.approver)
    if(this.approver == this.currentUserId){
      this.approveText = 'Approved'
    }
  }

	onTabChange($event: NgbTabChangeEvent) {
		 // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
		 // 	  $event.preventDefault();
   //   }                   
  		if ($event.nextId === 'Exit') {
        $event.preventDefault();
        console.log(this.activeComp);
    		this.router.navigateByUrl(this.exitLink);
  		} else if ($event.nextId === 'approval-tab') {
        $event.preventDefault();
        this.showApprovalModal(this.content);
      }else if ($event.nextId === 'Print') {
        $event.preventDefault();
        $('#printListQuotation > #printModalBtn').trigger('click');
      }else if($('.ng-dirty.ng-touched:not([type="search"])').length != 0 ){
        $event.preventDefault();
        const subject = new Subject<boolean>();
        const modal = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        subject.subscribe(a=>{
          if(a){
            $('.ng-dirty').removeClass('ng-dirty');
            this.tabset.select($event.nextId)
          }
        })
      }
 
  	}

  checkQuoteInfo(event){ 	
  		this.quoteInfo = event;
      this.passData.cessionDesc = this.quoteInfo.typeOfCession.toUpperCase()
      this.passData.status = this.quoteInfo.status;
      this.passData.quoteId = this.quoteInfo.quoteId;
      this.passData.reasonCd = this.quoteInfo.reasonCd;
  		setTimeout(() => { this.header = "/ " + (this.quoteInfo.quotationNo == '' ? this.quoteInfo.lineCd : this.quoteInfo.quotationNo) }, 0);
      this.reportsList = [];

  	if(this.quoteInfo.typeOfCession.toUpperCase() == 'RETROCESSION'){
  			/*this.reportsList.push({val:"QUOTER009B", desc:"RI Preparedness to Support Letter and RI Confirmation of Acceptance Letter" })*/
  			this.reportsList.push({val:"QUOTER009B", desc:"RI Preparedness to Support Letter" });
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
      this.selectedReport = this.reportsList[0].val;
  	}

  	showPrintPreview(content) {
        if (this.printType.toUpperCase() == 'SCREEN'){
  			window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + this.selectedReport + '&quoteId=' + this.quoteInfo.quoteId + '&userId=' + this.currentUserId, '_blank');
	  		this.modalService.dismissAll();
	  		} else if (this.printType.toUpperCase() == 'PDF'){
	  			this.downloadPDF(this.selectedReport,this.quoteInfo.quoteId);
	  	    	this.modalService.dismissAll();
	  		} else if (this.printType.toUpperCase() == 'PRINTER'){
	  			this.printPDF(this.selectedReport,this.quoteInfo.quoteId);
	  		    this.modalService.dismissAll();
	  		}
        
        if(this.quoteInfo.status == 'A'){
          this.quotationService.updateQuoteStatus(this.quoteInfo.quoteId, '3', this.currentUserId).subscribe((data)=>{
            if(data['returnCode'] == 0) {
              console.log("Status Failed to Update.");
            } else {
              console.log("Status Released");
              this.updateGenInfo();
            }
          });
        }
        

  	}

    showPrintDialog(event){
          if(this.quoteInfo.status == '97'){
            this.printDialog(event[0].printType,event[0].reportName)
          } else if (this.quoteInfo.status == '2' || this.quoteInfo.status == '96' || this.quoteInfo.status == '98'){
            this.printDialog(event[0].printType,event[0].reportName)
          } else {
            this.printDialog(event[0].printType,event[0].reportName)
          }

          //NECO 05/23/2019 --Update Status to Released when printing a quotation with an 'Approved' status.
          if(this.quoteInfo.status == 'A'){
            this.quotationService.updateQuoteStatus(this.quoteInfo.quoteId, '3').subscribe((data: any)=>{
              console.log(data);
            });
          }
          //END NECO 05/23/2019
    }

    printDialog(obj,selectedReport: string){
      if (obj.toUpperCase() == 'SCREEN'){
        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + selectedReport + '&quoteId=' + this.quoteInfo.quoteId + '&userId=' + this.currentUserId, '_blank');
        this.modalService.dismissAll();
        this.selectedReport = null;
      } else if (obj.toUpperCase() == 'PDF'){
        this.downloadPDF(selectedReport,this.quoteInfo.quoteId);
        this.selectedReport = null;
      } else if (obj.toUpperCase() == 'PRINTER'){
        this.printPDF(selectedReport,this.quoteInfo.quoteId);
        this.selectedReport = null;
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

    approveQuotation() {
      if (this.approveText.toLowerCase() == "Approved".toLowerCase()) {
        console.log("Call update quote status.");
        this.quotationService.updateQuoteStatus(this.quoteInfo.quoteId, 'A', this.currentUserId).subscribe((data)=>{
            if(data['returnCode'] == 0) {
              this.dialogIcon = "error-message";
              this.dialogMessage = "Status failed for Approval";
              this.successDiag.open();
            } else {
              this.dialogMessage = "Status Updated";
              this.dialogIcon = "success-message";
              this.successDiag.open();
              this.updateGenInfo();
            }
        })
      } else {
        this.quotationService.updateQuoteStatus(this.quoteInfo.quoteId, 'P', '').subscribe((data)=>{
          console.log(this.approver)
            if(data['returnCode'] == 0) {
              /*this.dialogMessage = data['errorList'][0].errorMessage;
              this.dialogIcon = "error";
              $('#quote-option #successModalBtn').trigger('click');*/
              this.dialogIcon = "error-message";
              this.dialogMessage = "Status failed for Approval";
              this.successDiag.open();
            } else {
              this.dialogMessage = "Pending for Approval";
              this.dialogIcon = "success-message";
              this.successDiag.open();
              this.updateGenInfo();
            }
        })
      }

      //this.genInfoComponent.ngOnInit();
      /*setTimeout(() => {
        this.router.navigate(['/quotation', { line: this.quoteInfo.lineCd,  quotationNo : this.quoteInfo.quotationNo, quoteId: this.quoteInfo.quoteId, from: 'quo-processing', inquiryFlag: true}], { skipLocationChange: true });
      },100); */
    }

    rejectQuotation(){
      this.quotationService.updateQuoteStatus(this.quoteInfo.quoteId, 'R', '').subscribe((data)=>{
            if(data['returnCode'] == 0) {
              /*this.dialogMessage = data['errorList'][0].errorMessage;
              this.dialogIcon = "error";
              $('#quote-option #successModalBtn').trigger('click');*/
              this.dialogIcon = "error-message";
              this.dialogMessage = "Status failed for Approval";
              this.successDiag.open();
            } else {
              this.dialogMessage = "Status Updated";
              this.dialogIcon = "success-message";
              this.successDiag.open();
              this.updateGenInfo();
            }
        })
    }

    updateGenInfo(){
      if(this.genInfoComponent != undefined){
        this.genInfoComponent.ngOnInit();
      }
      this.quotationService.getQuoteGenInfo(this.quoteInfo.quoteId,'').subscribe(a=>{
        this.quoteInfo.status = a['quotationGeneralInfo'].status;
        this.quoteInfo.statusDesc = a['quotationGeneralInfo'].statusDesc;
        console.log(this.quoteInfo.statusDesc)
        if(this.quoteInfo.status == '3'){
          this.inquiryFlag = true;
          this.activeComp.inquiryFlag = true;
          this.activeComp.ngOnInit();
        }
      })
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
