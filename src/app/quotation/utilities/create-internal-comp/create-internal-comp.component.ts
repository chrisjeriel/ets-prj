import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { ModalComponent, SucessDialogComponent } from '@app/_components/common';
import { QuotationService, NotesService } from '@app/_services';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router'

@Component({
  selector: 'app-create-internal-comp',
  templateUrl: './create-internal-comp.component.html',
  styleUrls: ['./create-internal-comp.component.css']
})
export class CreateInternalCompComponent implements OnInit {
  quoteInfo:any = {
  	quotationNoArr:[]

  };

  searchParams: any = {
        statusArr: [1,2,3,4,5,'P','A','R'],
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
	exclude: any[] = [];

	copyStatus = 0;
	copyFromQuotationNo: any = "";
	copyToQuotationNo: any = "";
	routeNewQuoteId: any;

	loading: boolean = false;
	dialogMessage = "";
    dialogIcon = "";

    
    @ViewChild('copyIntCompModal') copyIntCompModal: ModalComponent;

    @ViewChild(SucessDialogComponent) successMdl: SucessDialogComponent;

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

}
