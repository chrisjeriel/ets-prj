import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { ModalComponent, SucessDialogComponent } from '@app/_components/common';
import { QuotationService, NotesService } from '@app/_services';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnCedingCompanyComponent } from '@app/maintenance/mtn-ceding-company/mtn-ceding-company.component';

@Component({
  selector: 'app-copy-quote-details',
  templateUrl: './copy-quote-details.component.html',
  styleUrls: ['./copy-quote-details.component.css']
})
export class CopyQuoteDetailsComponent implements OnInit {
  quoteInfo:any = {
  	quotationNoArr:[]

  };

  searchParams: any = {
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
  };

  passDataQuoteLOV : any = {
		tableData	: [],
		tHeader		: ["Quotation No.", "Ceding Company", "Insured", "Risk"],
	  	sortKeys:['QUOTATION_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
		dataTypes	: ["text","text","text","text"],
		pageLength	: 10,
		resizable	: [false,false,false,false],
		tableOnly	: false,
		keys		: ['quotationNo','cedingName','insuredDesc','riskName'],
		pageStatus	: true,
		pagination	: true,
		colSize		: ['', '250px', '250px', '250px'],
		filters: [
			{key: 'quotationNo', title: 'Quotation No.',dataType: 'text'},
			{key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
			{key: 'insuredDesc',title: 'Insured',dataType: 'text'},
			{key: 'riskName',title: 'Risk',dataType: 'text'},
		]
	};

	completeSearch:boolean = false;

	@ViewChild('quoteMdl') quoteMdl: ModalComponent;
	@ViewChild(LoadingTableComponent) quoteTable: LoadingTableComponent;

	copyCedingId:string;
	copyCedingName: string;

	@ViewChild('cedingIntComp') cedingIntLov: CedingCompanyComponent;
	@ViewChild('ceding') cedingLov: CedingCompanyComponent;
	@ViewChild('copyRiskLOV') copyRiskLOV: MtnRiskComponent;
  @ViewChild(MtnCedingCompanyComponent) cedingCoNotMemberLov: MtnCedingCompanyComponent;

	exclude: any[] = [];

	copyStatus = 0;
	copyFromQuotationNo: any = "";
	copyToQuotationNo: any = "";
	routeNewQuoteId: any;

	loading: boolean = false;
	dialogMessage = "";
    dialogIcon = "";

    
    @ViewChild('copyIntCompModal') copyIntCompModal: ModalComponent;
    @ViewChild('copyModal') copyModal: ModalComponent;

    @ViewChild(SucessDialogComponent) successMdl: SucessDialogComponent;

    trueCopyStatus:number = 0;
    trueCopyCedingId:string;
	trueCopyCedingName: string;
	copyRiskId: any = "";
	copyRiskName: any = "";

  typeOfCessionId:any = '';
  typeOfCession:any = '';
  reinsurerId:any = "";
  reinsurerName:any = "";
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;

	mdlConfig = {
        mdlBtnAlign: 'center',
    };

  constructor(private qs : QuotationService, private ns: NotesService, public modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  }

  clearAll(){
  	this.completeSearch = false;
  	this.quoteInfo  = {
  		quotationNo 	: '',
  		quotationNoArr  : [],
  		cedingName		: '',
  		insuredDesc		: '',
  		riskName		: '',
  		totalSi			: '',
  		status			: ''
  	};
  	this.searchParams.quotationNo = this.quoteInfo.quotationNoArr.map(a=>a.toUpperCase()).join('%-%');
	this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
	this.passDataQuoteLOV.filters[0].enabled =true;
  }

    search(key,ev) {
		this.quoteInfo.quotationNoArr[0] =  (this.quoteInfo.quotationNoArr[0] == undefined || this.quoteInfo.quotationNoArr[0] == '')?'':this.quoteInfo.quotationNoArr[0];
		this.quoteInfo.quotationNoArr[1] =  (this.quoteInfo.quotationNoArr[1] == undefined || this.quoteInfo.quotationNoArr[1] == '')?'':this.quoteInfo.quotationNoArr[1];
  		this.quoteInfo.quotationNoArr[2] =  (this.quoteInfo.quotationNoArr[2] == undefined || this.quoteInfo.quotationNoArr[2] == '')?'':this.quoteInfo.quotationNoArr[2].padStart(5,'0');
  		this.quoteInfo.quotationNoArr[3] =  (this.quoteInfo.quotationNoArr[3] == undefined || this.quoteInfo.quotationNoArr[3] == '')?'':this.quoteInfo.quotationNoArr[3].padStart(2,'0');
  		this.quoteInfo.quotationNoArr[4] =  (this.quoteInfo.quotationNoArr[4] == undefined || this.quoteInfo.quotationNoArr[4] == '')?'':this.quoteInfo.quotationNoArr[4].padStart(3,'0');
  		
  		this.searchParams.quotationNo = this.quoteInfo.quotationNoArr.map(a=>a.toUpperCase()).join('%-%');
  		this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
      	this.passDataQuoteLOV.filters[0].enabled =true;

  		if(this.quoteInfo.quotationNoArr.includes('')) {
  			//this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
  			this.completeSearch = false;
  			this.quoteInfo  = {
  				quotationNo 	: '',
  				quotationNoArr  : this.quoteInfo.quotationNoArr,
  				cedingName		: '',
  				insuredDesc		: '',
  				riskName		: '',
  				totalSi			: '',
  				status			: ''
  			};
  		}else{
  			this.completeSearch = true;
  			this.getQuoteList();
  		}
  	}

	getQuoteList(){
		this.qs.newGetQuoProcessingData(this.searchParams).subscribe(a=>{
			this.passDataQuoteLOV.count = a['length'];
			this.quoteTable.placeData(a['quotationList'].map(i => 
					{ 
						i.riskName = (i.project == null || i.project == undefined)?'':i.project.riskName;
					  	return i;
					}
				)
			); 
			if(a['quotationList'].length == 1 && this.completeSearch){
				this.quoteInfo = a['quotationList'][0];
				this.quoteInfo.quotationNoArr = this.quoteInfo.quotationNo.split('-');
				this.filterCedComp();
			}else if(a['quotationList'].length == 0 && this.completeSearch){
				this.searchParams = {
										'paginationRequest.count':10,
				        				'paginationRequest.position':1,   
				        			};
    			this.completeSearch = false;
    			this.showQuoteLov();
			}
		});
	}

	filterCedComp(){
		this.qs.getIntCompAdvInfo({quoteId:this.quoteInfo.quoteId, quotationNo: this.quoteInfo.quotationNo}).subscribe(a=>{
	        this.exclude = a['quotation'].map(a=>a.competitionsList[0].cedingId);
	        if(this.exclude.length == 0 ){
	            this.exclude = [this.quoteInfo.cedingId];
	        }
	    })
	}

	showQuoteLov(){
		this.quoteMdl.openNoClose();
		this.getQuoteList();
	}

	searchQuery(searchParams){
		for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
        this.completeSearch = false;
		this.getQuoteList();
	}

	onClickOkQuoteLov(){
		this.quoteInfo = this.quoteTable.indvSelect;
		this.quoteInfo.quotationNoArr = this.quoteInfo.quotationNo.split('-');
		this.filterCedComp();
		this.quoteMdl.closeModal();
		console.log(this.quoteInfo)
	}

	checkCode(ev, field){
	    this.ns.lovLoader(ev, 1);

	    if(field === 'cedingCoIntComp') {
	        this.cedingIntLov.checkCode(String(this.copyCedingId).padStart(3, '0'), ev);
	    } else if(field === 'cedingCo') {
            this.cedingLov.checkCode(String(this.trueCopyCedingId).padStart(3, '0'), ev);            
        } else if(field === 'copyRisk') {
            this.copyRiskLOV.checkCode(this.copyRiskId, '#copyRiskLOV', ev);
        }else if(field === 'RI'){
          this.reinsurerId = this.pad(this.reinsurerId);
          this.cedingCoNotMemberLov.checkCode(this.reinsurerId, ev);
      }else if(field === 'typeOfCession'){
          this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
      } 
	}

	setCedingIntCompCompany(data) {
        this.copyCedingId = data.cedingId;
        this.copyCedingName = data.cedingName;
        this.ns.lovLoader(data.ev, 0);
    }

    showCedingCompanyIntCompLOV() {
        this.cedingIntLov.modal.openNoClose();
    }

    clearCopyFields() {
        this.copyCedingId = '';
        this.copyCedingName = '';
        this.trueCopyCedingId = '';
        this.trueCopyCedingName = '';
        this.copyRiskId = '';
        this.copyRiskName = '';
    }

    copyIntCompOkBtn() {
            this.loading = true;
            var currentDate = this.ns.toDateTimeString(0);

            //change copyStatus to 1 if successful
            var params = {
                "autoIntComp": 'N',
                "cedingId": this.copyCedingId,
                "copyingType": 'internalComp',
                "createDate": currentDate,
                "createUser": this.ns.getCurrentUser(),
                "lineCd": this.quoteInfo.quotationNoArr[0],
                "quoteId": this.quoteInfo.quoteId,
                "quoteYear": new Date().getFullYear().toString(),
                "riskId": this.quoteInfo.project.riskId,
                "updateDate": currentDate,
                "updateUser": this.ns.getCurrentUser(),
            }

            this.qs.saveQuotationCopy(JSON.stringify(params)).subscribe(data => {
                this.loading = false;            

                if(data['returnCode'] == -1) {
                    
                    this.copyToQuotationNo = data['quotationNo'];
                    this.routeNewQuoteId = data['quoteId'];

                    //insert sa quote_competition
                    var internalCompParams: any[] = [{
                        adviceNo: 0,
                        cedingId: this.copyCedingId,
                        cedingRepId: 0,
                        createDate: currentDate,
                        createUser: JSON.parse(window.localStorage.currentUser).username,
                        quoteId: data['quoteId'],
                        updateDate: currentDate,
                        updateUser: JSON.parse(window.localStorage.currentUser).username,
                    }];

                    this.qs.saveQuoteCompetition(internalCompParams).subscribe((result: any) => {
                        console.log(result);
                    });
                    //end insert

                    this.copyStatus = 1;
                    this.copyCedingId = "";
                    this.copyCedingName = "";

                    // this.retrieveQuoteListingMethod();
                } else if (data['returnCode'] == 0) {
                    this.dialogMessage = data['errorList'][0].errorMessage;
                    this.dialogIcon = "error";

                    this.successMdl.open();
                }
            });
        }
        intCompToGenInfo() {
            let line = this.copyToQuotationNo.split("-")[0];
            let quotationNo = this.copyToQuotationNo;

            this.qs.toGenInfo = [];
            this.qs.toGenInfo.push("edit", line);
            
            this.qs.savingType = 'normal';

            setTimeout(() => {
                this.router.navigate(['/quotation', { line: line, quoteId: this.routeNewQuoteId, quotationNo: quotationNo, from: 'quo-processing', exitLink: '/quotation-processing' }], { skipLocationChange: true });
            },100); 
        }

        setCedingcompany(data){
            this.trueCopyCedingId = data.cedingId;
            this.trueCopyCedingName = data.cedingName;
            this.ns.lovLoader(data.ev, 0);

            /*if(data.hasOwnProperty('fromLOV')){
                this.onClickCopy(1);
            }  */      
        }

        setCopyRisks(data){
            this.copyRiskId = data.riskId;
            this.copyRiskName = data.riskName;
            this.ns.lovLoader(data.ev, 0);
        }

        clearAddFields(){
            this.trueCopyCedingName = '';
            this.trueCopyCedingId = '';
            this.copyRiskName = '';
            this.copyRiskId= '';
        }

        copyOkBtn() {        
            this.loading = true;
            var currentDate = this.ns.toDateTimeString(0);

            //change copyStatus to 1 if successful
            var params = {
                // "autoIntComp": this.autoIntComp,
                "cedingId": this.trueCopyCedingId,
                "copyingType": 'normal',
                "createDate": currentDate,
                "createUser": this.ns.getCurrentUser(), //JSON.parse(window.localStorage.currentUser).username,
                "lineCd": this.quoteInfo.quotationNoArr[0],
                "quoteId": this.quoteInfo.quoteId,
                "quoteYear": new Date().getFullYear().toString(),
                "riskId": this.copyRiskId,
                "updateDate": currentDate,
                "updateUser": this.ns.getCurrentUser(),
                "cessionId" : this.typeOfCessionId,
                "reinsurerId" : this.typeOfCessionId == 2 ? this.reinsurerId : ''  //JSON.parse(window.localStorage.currentUser).username,
            }

            this.qs.saveQuotationCopy(JSON.stringify(params)).subscribe(data => {
                this.loading = false;
                
                if(data['returnCode'] == -1) {
                    this.copyToQuotationNo = data['quotationNo'];
                    this.routeNewQuoteId = data['quoteId'];

                    this.trueCopyStatus = 1;
                    this.copyCedingId = "";
                    this.copyCedingName = "";
                    this.copyRiskId = "";
                    this.copyRiskName = "";                
                } else if (data['returnCode'] == 0) {
                    this.dialogMessage = data['errorList'][0].errorMessage;
                    this.dialogIcon = "error";
                    this.successMdl.open();
                }
            });
        }

        setTypeOfCession(data) {        
            this.typeOfCessionId = data.cessionId;
            this.typeOfCession = data.description;
            this.ns.lovLoader(data.ev, 0);
            
            /*if(data.hasOwnProperty('fromLOV')){
                this.onClickAdd('#typeOfCessionId');    
            } */
        }

        showTypeOfCessionLOV(){
            // $('#typeOfCessionLOV #modalBtn').trigger('click');
            this.typeOfCessionLov.modal.openNoClose();
        }

        pad(str, num?) {
            if(str === '' || str == null){
                return '';
            }
            
            return String(str).padStart(num != null ? num : 3, '0');
        }

        setReinsurer(event) {
            this.reinsurerId = this.pad(event.cedingId);
            this.reinsurerName = event.cedingName;
            this.ns.lovLoader(event.ev, 0);
        }

        showCedingCompanyNotMemberLOV() {
            this.cedingCoNotMemberLov.modal.openNoClose();
        }

}
