import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, UnderwritingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-value-coverage',
  templateUrl: './pol-value-coverage.component.html',
  styleUrls: ['./pol-value-coverage.component.css']
})
export class PolValueCoverageComponent implements OnInit {
  
  @ViewChild("sectionTable") sectionTable: CustEditableNonDatatableComponent;
  @ViewChild("deductiblesTable") deductiblesTable: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lov :LovComponent;
  @ViewChild(MtnSectionCoversComponent) secCoversLov: MtnSectionCoversComponent;
  @ViewChild('infoCov') modal : ModalComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
    tHeader:['Section','Bullet No','Cover Name','Sum Insured','Rate(%)','Premium','Sum Insured','Rate(%)','Premium','D/S','Add SI'],
    tableData:[],
    tHeaderWithColspan:[],
    dataTypes:['text','text','lovInput','currency','percent','currency','currency','percent','currency','checkbox','checkbox'],
    tabIndexes: [false,false,false,false,false,false,true,true,true,true,true],
    tooltip:[null,null,null,null,null,null,null,null,null,'Discount / Surcharge',null],
    nData: {
      section: null,
      bulletNo: null,
      description: null,
      sumInsured: null,
      premRt: null,
      premAmt: null,
      altSumInsured: null,
      altRate: null,
      altPremium: null,
      discountTag: 'N',
      addSi: 'N',
      deductiblesSec: [],
      createDateSec: this.ns.toDateTimeString(0),
      createUserSec: JSON.parse(window.localStorage.currentUser).username,
      updateDateSec: this.ns.toDateTimeString(0),
      updateUserSec:JSON.parse(window.localStorage.currentUser).username,
      showMG:1
    },
    pageID: 'altCoverage',
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[55,65,140,90,90,90,90,90,90,80,50],
    magnifyingGlass: ['coverName'],
    uneditable:[true,true,false,true,true,true,false,false,false,false,false],
    keys:['section','bulletNo','coverName','orgSumInsured','orgPremRt','orgPremAmt','sumInsured','premRt','premAmt','discountTag','addSi'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  passDataPerSection: any = {
    tableData:[],
    tHeader:['Section','Sum Insured','Premium'],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:['text','currency','currency'],
    keys:['section','sumInsured','premium'],
    uneditable:[true,true,true],
    pageLength: 3
  };

  passDataDeductibles: any = {
        tHeader: ["Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
        dataTypes: ["text","text","text", "percent", "currency"],
        pageLength:5,
        searchFlag: true,
        checkFlag: true,
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1],
        magnifyingGlass: ['deductibleCd'],
        keys:['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        uneditable: [true,true,false,false,false],
        tableData:[],
        pageID:'deductibles',
        disableAdd: true, 
        nData: {
          showMG : 1,
          coverCd: null,
          createDate: this.ns.toDateTimeString(0),
          createUser: JSON.parse(window.localStorage.currentUser).username,
          deductibleAmt: 0,
          deductibleCd: null,
          deductibleRt: 0,
          deductibleTxt: '',
          endtCd: "0",
          updateDate: this.ns.toDateTimeString(0),
          updateUser:JSON.parse(window.localStorage.currentUser).username
        }
    };

    fullCoverageDetails : any = {
    	projId: null,
    	riskId: null,
    	currencyCd: null,
    	currencyRt: null,
    	totalSi: null,
    	totalPrem: null,
    	treatyShare: null,
    	pctShare: null,
    	pctPml: null,
    	totalValue: null,
    	remarks: null,
    	saveFullSectionCovers: [],
    	deleteFullSectionCovers: [],
    	saveDeductibleList: [],
    	deleteDeductibleList : []
    }

    saveDataFullCoverage: any ={
    	currencyCd: null,
    	currencyRt: null,
    	totalSi: null,
    	totalPrem: null,
    	treatyShare: null,
    	pctShare: null,
    	pctPml: null,
    	totalValue: null,
    	remarks: null,
    	saveFullSectionCovers: [],
    	deleteFullSectionCovers: [],
    	saveDeductibleList: [],
    	deleteDeductibleList : []
    }

    currentCoverCd: any;
    sectionISi: number = 0;
    sectionIISi: number = 0;
    sectionIIISi: number = 0;
    sectionIPrem: number = 0;
    sectionIIPrem: number = 0;
    sectionIIIPrem: number = 0;
    totalSi: number = 0;
    totalPrem: number = 0;
    line: any = '';
    hideSectionCoverArray: any[] = [];
    sectionCoverLOVRow: number;
    lovCheckBox:boolean = false;
    passLOVData: any = {};
    lovRowData:any;
    editedData: any = [];
    deletedData: any = [];
    editedDedt: any = [];
    deletedDedt:any = [];
    dialogIcon:string = '';
	  dialogMessage:string;
    cancelFlag:boolean;
    policyId: any;
    risk: any;
    insured: any;
    policyNo: any;
    promptMessage: string = "";
    promptType: string = "";

  constructor( private ns: NotesService, private underwritingService: UnderwritingService, private modalService: NgbModal, private decimal : DecimalPipe, private route: ActivatedRoute) { }


  ngOnInit() {
  		this.passData.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "", span: 3 },
  		  { header: "Original Value", span: 3 }, { header: "100% Value", span: 5 });
  		this.passDataPerSection.tableData = [['SECTION I','',''],['SECTION II','',''],['SECTION III','','']]

  		this.route.params.subscribe((params) => {
        console.log(params)
  			this.policyId = params.policyId;
  			this.line = params.policyNo.split('-')[0],
  			this.insured = params.insuredDesc;
  			this.risk 	 = params.riskName;
  			this.policyNo = params.policyNo;
  		})
  		this.getFullCoverage();
  }

  getFullCoverage(){
  	this.sectionISi = 0;
  	this.sectionIISi = 0;
  	this.sectionIIISi = 0;
  	this.sectionIPrem = 0;
  	this.sectionIIPrem = 0;
  	this.sectionIIIPrem = 0;
  	this.totalSi = 0;
  	this.totalPrem = 0;
  	this.passData.tableData = [];
  	this.underwritingService.getFullCoverage(null,this.policyId).subscribe((data:any) => {
  		console.log(data)
  		if(data.policy.project !== null){
  			var datas = data.policy.project.fullCoverage.fullSecCover;
  			this.fullCoverageDetails 			     = data.policy.project.fullCoverage;
        this.fullCoverageDetails.secISiTag   = this.fullCoverageDetails.secISiTag == null ? 'N': 'Y';
        this.fullCoverageDetails.secIISiTag  = this.fullCoverageDetails.secIISiTag == null ? 'N': 'Y';
        this.fullCoverageDetails.secIIISiTag = this.fullCoverageDetails.secIIISiTag == null ? 'N': 'Y';
  			this.fullCoverageDetails.projId 	 = data.policy.project.projId;
  			this.fullCoverageDetails.riskId 	 = data.policy.project.riskId;
  			this.fullCoverageDetails.treatyShare = this.decimal.transform(this.fullCoverageDetails.treatyShare, '1.10-10');
  			this.fullCoverageDetails.pctShare    = this.decimal.transform(this.fullCoverageDetails.pctShare , '1.10-10');
  			this.fullCoverageDetails.totalValue  = this.decimal.transform(this.fullCoverageDetails.totalValue, '1.2-2');
  			this.fullCoverageDetails.pctPml		 = this.decimal.transform(this.fullCoverageDetails.pctPml, '1.10-10');
  			for(var i = 0 ; i < datas.length;i++){
  				this.passData.tableData.push(datas[i]);
  				if(this.line == 'CAR' || this.line == 'EAR'){
  					if(datas[i].section == 'I' ){
              if(datas[i].addSi == 'Y'){
    						this.sectionISi   	+= datas[i].sumInsured;
    						this.sectionIPrem   += datas[i].premAmt;

                this.totalSi     += datas[i].sumInsured;
              }
  						this.totalPrem 		+= datas[i].premAmt;
  					}else if(datas[i].section == 'II'){
              if(datas[i].addSi == 'Y'){
                this.sectionIISi    += datas[i].sumInsured;
                this.sectionIIPrem   += datas[i].premAmt;
              }
  						this.totalPrem		+= datas[i].premAmt;
  					}else if(datas[i].section == 'III'){
              if(datas[i].addSi == 'Y'){
                this.sectionIIISi     += datas[i].sumInsured;
                this.sectionIIIPrem  += datas[i].premAmt;

                this.totalSi    += datas[i].sumInsured;
              }
  						this.totalPrem		+= datas[i].premAmt;
  					}
  				}else if(this.line == 'EEI'){
  					if(datas[i].section == 'I'){
              if(datas[i].addSi == 'Y'){
                this.sectionISi     += datas[i].sumInsured;
                this.sectionIPrem   += datas[i].premAmt;

                this.totalSi     += datas[i].sumInsured;
              }
  						this.totalPrem 		+= datas[i].premAmt;
  					}else if(datas[i].section == 'II'){
              if(datas[i].addSi == 'Y'){
                this.sectionIISi    += datas[i].sumInsured;
                this.sectionIIPrem   += datas[i].premAmt;
                this.totalSi    += datas[i].sumInsured;
              }
  						this.totalPrem		+= datas[i].premAmt;
  					}else if(datas[i].section == 'III'){
              if(datas[i].addSi == 'Y'){
                this.sectionIIISi     += datas[i].sumInsured;
                this.sectionIIIPrem  += datas[i].premAmt;

                this.totalSi    += datas[i].sumInsured;
              }
  						this.totalPrem		+= datas[i].premAmt;
  					}
  				}else {
  					if(datas[i].section == 'I'){
              if(datas[i].addSi == 'Y'){
                this.sectionISi     += datas[i].sumInsured;
                this.sectionIPrem   += datas[i].premAmt;

                this.totalSi     += datas[i].sumInsured;
              }
  						this.totalPrem 		+= datas[i].premAmt;
  					}else if(datas[i].section == 'II'){
              if(datas[i].addSi == 'Y'){
                this.sectionIISi    += datas[i].sumInsured;
                this.sectionIIPrem   += datas[i].premAmt;
              }
  						this.totalPrem		+= datas[i].premAmt;
  					}else if(datas[i].section == 'III'){
              if(datas[i].addSi == 'Y'){
                this.sectionIIISi     += datas[i].sumInsured;
                this.sectionIIIPrem  += datas[i].premAmt;
              }
  						this.totalPrem		+= datas[i].premAmt;
  					}
  				}
  			}
  			this.sectionTable.refreshTable();
  			this.sectionTable.onRowClick(null,this.passData.tableData[0]);
  			this.passDataPerSection.tableData[0].section = 'SECTION I'
  			this.passDataPerSection.tableData[0].sumInsured = this.sectionISi;
  			this.passDataPerSection.tableData[0].premium = this.sectionIPrem;
  			this.passDataPerSection.tableData[1].section = 'SECTION II'
  			this.passDataPerSection.tableData[1].sumInsured = this.sectionIISi;
  			this.passDataPerSection.tableData[1].premium = this.sectionIIPrem;
  			this.passDataPerSection.tableData[2].section = 'SECTION III'
  			this.passDataPerSection.tableData[2].sumInsured = this.sectionIIISi;
  			this.passDataPerSection.tableData[2].premium = this.sectionIIIPrem;

  			
  			this.fullCoverageDetails.totalSi = this.totalSi;
  			this.fullCoverageDetails.totalPrem = this.totalPrem;
  			this.fullCoverageDetails.sectionISi = this.sectionISi;
  			this.fullCoverageDetails.sectionIISi = this.sectionIISi;
  			this.fullCoverageDetails.sectionIIISi = this.sectionIIISi;
  			this.fullCoverageDetails.sectionIPrem = this.sectionIPrem;
  			this.fullCoverageDetails.sectionIIPrem = this.sectionIIPrem;
  			this.fullCoverageDetails.sectionIIIPrem = this.sectionIIIPrem;


  		}
  		this.getEditableCov();
  	})
  }

  rowClick(data){
  	console.log(data)
  	if(data === null){
  		this.passDataDeductibles.disableAdd = true;
  		this.passDataDeductibles.tableData =[];
  		this.deductiblesTable.refreshTable();
  	}else{
  		this.passDataDeductibles.disableAdd = false;
  		this.currentCoverCd = data.coverCd;
  		this.deductibleData(data)
  	}
  }

  deductibleData(data){
  	if(data !== null && data.deductiblesSec !== undefined){
      this.passDataDeductibles.nData.coverCd = this.currentCoverCd
      this.passDataDeductibles.tableData = data.deductiblesSec;
    }else {
      this.passDataDeductibles.tableData = [];
    }
    this.deductiblesTable.refreshTable();
  }

  update(data){
  	this.sectionISi = 0;
  	this.sectionIISi = 0;
  	this.sectionIIISi = 0;
  	this.sectionIPrem = 0;
  	this.sectionIIPrem = 0;
  	this.sectionIIIPrem = 0;
  	this.totalSi = 0;
  	this.totalPrem = 0;

  	if(data.hasOwnProperty('lovInput')) {
      this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});

      data.ev['index'] = data.index;
      data.ev['filter'] = this.hideSectionCoverArray;

      this.secCoversLov.checkCode(data.ev.target.value, data.ev);
    }   

  	for(var i = 0; i< this.passData.tableData.length;i++){
  		this.passData.tableData[i].premAmt = this.passData.tableData[i].discountTag == 'Y' ? this.passData.tableData[i].premAmt: this.passData.tableData[i].sumInsured * (this.passData.tableData[i].premRt/100);
  		if(this.line == 'CAR' || this.line == 'EAR'){
  			if(this.passData.tableData[i].section == 'I'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionISi     += this.passData.tableData[i].sumInsured;
            this.sectionIPrem   += this.passData.tableData[i].premAmt;

            this.totalSi     += this.passData.tableData[i].sumInsured;
          }
  				this.totalPrem 		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'II'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionIISi    += this.passData.tableData[i].sumInsured;
            this.sectionIIPrem   += this.passData.tableData[i].premAmt;
          }
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'III'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionIIISi     += this.passData.tableData[i].sumInsured;
            this.sectionIIIPrem  += this.passData.tableData[i].premAmt;

            this.totalSi    += this.passData.tableData[i].sumInsured;
          }
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}
  		}else if(this.line == 'EEI'){
  			if(this.passData.tableData[i].section == 'I'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionISi     += this.passData.tableData[i].sumInsured;
            this.sectionIPrem   += this.passData.tableData[i].premAmt;

            this.totalSi     += this.passData.tableData[i].sumInsured;
          }
  				this.totalPrem 		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'II'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionIISi    += this.passData.tableData[i].sumInsured;
            this.sectionIIPrem   += this.passData.tableData[i].premAmt;
            this.totalSi    += this.passData.tableData[i].sumInsured;
          }
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'III'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionIIISi     += this.passData.tableData[i].sumInsured;
            this.sectionIIIPrem  += this.passData.tableData[i].premAmt;

            this.totalSi    += this.passData.tableData[i].sumInsured;
          }
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}
  		}else {
  			if(this.passData.tableData[i].section == 'I'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionISi     += this.passData.tableData[i].sumInsured;
            this.sectionIPrem   += this.passData.tableData[i].premAmt;

            this.totalSi     += this.passData.tableData[i].sumInsured;
          }
  				this.totalPrem 		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'II'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionIISi    += this.passData.tableData[i].sumInsured;
            this.sectionIIPrem   += this.passData.tableData[i].premAmt;
          }
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'III'){
          if(this.passData.tableData[i].addSi == 'Y'){
            this.sectionIIISi     += this.passData.tableData[i].sumInsured;
            this.sectionIIIPrem  += this.passData.tableData[i].premAmt;
          }
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}
  		}
  	}

  	this.passDataPerSection.tableData[0].section = 'SECTION I'
  	this.passDataPerSection.tableData[0].sumInsured = this.sectionISi;
  	this.passDataPerSection.tableData[0].premium = this.sectionIPrem;
  	this.passDataPerSection.tableData[1].section = 'SECTION II'
  	this.passDataPerSection.tableData[1].sumInsured = this.sectionIISi;
  	this.passDataPerSection.tableData[1].premium = this.sectionIIPrem;
  	this.passDataPerSection.tableData[2].section = 'SECTION III'
  	this.passDataPerSection.tableData[2].sumInsured = this.sectionIIISi;
  	this.passDataPerSection.tableData[2].premium = this.sectionIIIPrem;

  	
  	this.fullCoverageDetails.totalSi = this.totalSi;
  	this.fullCoverageDetails.totalPrem = this.totalPrem;
  	this.fullCoverageDetails.sectionISi = this.sectionISi;
  	this.fullCoverageDetails.sectionIISi = this.sectionIISi;
  	this.fullCoverageDetails.sectionIIISi = this.sectionIIISi;
  	this.fullCoverageDetails.sectionIPrem = this.sectionIPrem;
  	this.fullCoverageDetails.sectionIIPrem = this.sectionIIPrem;
  	this.fullCoverageDetails.sectionIIIPrem = this.sectionIIIPrem;

  	this.getEditableCov();

    if(this.fullCoverageDetails.totalSi > parseFloat(this.fullCoverageDetails.totalValue.toString().split(',').join(''))){
      this.promptMessage = "Max sum insured of the policy exceeded the total contract value of the project.";
      this.promptType = "totalval";
      this.modal.open();
    }
  }

  regenerate(){
  console.log(this.fullCoverageDetails.treatyShare) ;
  	for(var i = 0; i < this.passData.tableData.length;i++){
  		this.passData.tableData[i].edited	  = true;
  		this.passData.tableData[i].sumInsured = this.passData.tableData[i].orgSumInsured == null ? 0:this.passData.tableData[i].orgSumInsured / (this.fullCoverageDetails.treatyShare * 100)
  		this.passData.tableData[i].premRt     = this.passData.tableData[i].orgSumInsured == null ? 0:this.passData.tableData[i].premRt
  		this.passData.tableData[i].premAmt    = this.passData.tableData[i].sumInsured * (this.passData.tableData[i].premRt/100);
  	}
  	this.update(this.passData.tableData);
  }

   sectionCoversLOV(data){
     	  this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
          $('#sectionCoversLOV #modalBtn').trigger('click');
          this.sectionCoverLOVRow = data.index;
        
  } 

   selectedSectionCoversLOV(data){
         if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
           console.log('true')
           this.sectionCoverLOVRow = data[0].ev.index;
           this.ns.lovLoader(data[0].ev, 0);
         }

         $('#cust-table-container').addClass('ng-dirty');
         // this.passData.tableData[this.sectionCoverLOVRow].coverCd = data[0].coverCd; 
         // this.passData.tableData[this.sectionCoverLOVRow].coverCdAbbr = data[0].coverCdAbbr;
         // this.passData.tableData[this.sectionCoverLOVRow].section = data[0].section;
         // this.passData.tableData[this.sectionCoverLOVRow].bulletNo = data[0].bulletNo;
         // this.passData.tableData[this.sectionCoverLOVRow].sumInsured = 0;
         // this.passData.tableData[this.sectionCoverLOVRow].edited = true;

         if(data[0].coverCd != '' && data[0].coverCd != null && data[0].coverCd != undefined) {
           //HIDE THE POWERFUL MAGNIFYING GLASS
           this.passData.tableData[this.sectionCoverLOVRow].showMG = 1;
         }
         this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);

         //this.validateSectionCover();
         for(var i = 0; i<data.length;i++){
           this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
           this.passData.tableData[this.passData.tableData.length - 1].coverCd = data[i].coverCd;
           this.passData.tableData[this.passData.tableData.length - 1].coverName = data[i].coverName;
           this.passData.tableData[this.passData.tableData.length - 1].section = data[i].section;
           this.passData.tableData[this.passData.tableData.length - 1].bulletNo = data[i].bulletNo;
           this.passData.tableData[this.passData.tableData.length - 1].edited = true;
           this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;

           if(data[i].coverName !== undefined && data[i].coverName.substring(0,6).toUpperCase()){
                this.passData.tableData[this.passData.tableData.length - 1].others = true;
           }
         }
         this.sectionTable.refreshTable();
    }

    clickDeductiblesLOV(data){
    if(data.key=="deductibleCd"){
      this.lovCheckBox = true;
      this.passLOVData.selector = 'deductibles';
      this.passLOVData.lineCd = this.line;
      this.passLOVData.params = {
        coverCd : data.data.coverCd == null ? 0: data.data.coverCd,
        endtCd: '0',
        activeTag:'Y'
      }
      this.passLOVData.hide = this.passDataDeductibles.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
      this.lovRowData = data.data;
    }
    this.lov.openLOV();
  }

  setSelected(data){
    if(data.selector == 'deductibles'){
      this.passDataDeductibles.tableData = this.passDataDeductibles.tableData.filter(a=>a.showMG!=1);
      for(var i = 0; i<data.data.length;i++){
        this.passDataDeductibles.tableData.push(JSON.parse(JSON.stringify(this.passDataDeductibles.nData)));
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].edited = true;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length - 1].showMG = 0;
      }
      this.sectionTable.indvSelect.deductiblesSec = this.passDataDeductibles.tableData;
      this.deductiblesTable.tableDataChange.emit(this.deductiblesTable.passData.tableData);
      this.deductiblesTable.refreshTable();
    }
    this.deductiblesTable.markAsDirty();
  }

  prepareData() {
  	this.editedData   = [];
  	this.deletedData  = [];
  	this.editedDedt   = [];
  	this.deletedDedt  = [];


  	this.fullCoverageDetails.policyId 			= this.policyId;
    this.fullCoverageDetails.createDate 		= this.ns.toDateTimeString(this.fullCoverageDetails.createDate);
    this.fullCoverageDetails.updateDate 		= this.ns.toDateTimeString(this.fullCoverageDetails.updateDate);
    this.fullCoverageDetails.pctShare 			= parseFloat(this.fullCoverageDetails.pctShare.toString().split(',').join(''));
    this.fullCoverageDetails.totalValue 		= parseFloat(this.fullCoverageDetails.totalValue.toString().split(',').join(''));
    this.fullCoverageDetails.pctPml 			= parseFloat(this.fullCoverageDetails.pctPml.toString().split(',').join(''));

  	for(var i = 0; i < this.passData.tableData.length;i++){
  		if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  			this.editedData.push(this.passData.tableData[i]);
  			if(this.passData.tableData[i].discountTag != 'Y'){
  			  this.editedData[this.editedData.length - 1].premAmt =  this.editedData[this.editedData.length - 1].sumInsured *(this.editedData[this.editedData.length - 1].premRt/100);
  			}else{
  			  this.editedData[this.editedData.length - 1].premAmt =  this.passData.tableData[i].premAmt;
  			}

  			this.editedData[this.editedData.length - 1].lineCd		  = this.line;
  			this.editedData[this.editedData.length - 1].cumSi		  = this.editedData[this.editedData.length - 1].sumInsured;
  			this.editedData[this.editedData.length - 1].cumPrem		  = this.editedData[this.editedData.length - 1].premAmt;
  			this.editedData[this.editedData.length - 1].createDateSec = this.ns.toDateTimeString(this.passData.tableData[i].createDateSec);
  			this.editedData[this.editedData.length - 1].updateDateSec = this.ns.toDateTimeString(this.passData.tableData[i].updateDateSec);
  		}

  		if(this.passData.tableData[i].deleted){
  			this.deletedData.push(this.passData.tableData[i]);
  		}

  		for(var j = 0 ; j < this.passData.tableData[i].deductiblesSec.length;j++){
          if(this.passData.tableData[i].deductiblesSec[j].edited && !this.passData.tableData[i].deductiblesSec[j].deleted){
            this.editedDedt.push(this.passData.tableData[i].deductiblesSec[j]);
          }else if(this.passData.tableData[i].deductiblesSec[j].deleted){
            this.deletedDedt.push(this.passData.tableData[i].deductiblesSec[j]);
          }
      	}	
  	}

  	this.fullCoverageDetails.saveFullSectionCovers 		= this.editedData;
  	this.fullCoverageDetails.deleteFullSectionCovers 	= this.deletedData;
  	this.fullCoverageDetails.saveDeductibleList 		= this.editedDedt;
  	this.fullCoverageDetails.deleteDeductibleList 		= this.deletedDedt;
  }

  saveData(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.prepareData();
  	this.underwritingService.savePolFullCoverage(this.fullCoverageDetails).subscribe((data: any) => {
  	  if(data['returnCode'] == 0) {
  	    this.dialogMessage = data['errorList'][0].errorMessage;
  	    this.dialogIcon = "error";
  	    this.successDiag.open();
  	    //$('#fullCoveragevalue #successModalBtn').trigger('click');
  	    console.log('failed');
  	  } else{
  	    this.dialogMessage = "";
  	    this.dialogIcon = "success";
  	    this.successDiag.open();
  	    //$('#fullCoveragevalue #successModalBtn').trigger('click');
  	    this.sectionTable.markAsPristine();
  	    this.deductiblesTable.markAsPristine();
  	    this.getFullCoverage();
  	    this.deductiblesTable.refreshTable();
  	    console.log('success');
  	  }
  	});
  }

  openPrint(){
  	$('#printModal #modalBtn').trigger('click');
  }
  
  pctShare(data){
        this.fullCoverageDetails.totalValue = (parseFloat(this.fullCoverageDetails.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(2);
        this.fullCoverageDetails.totalValue = this.decimal.transform(this.fullCoverageDetails.totalValue, '1.2-2');  
  }

   totalValue(data){
      this.fullCoverageDetails.pctShare = (parseFloat(this.fullCoverageDetails.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(10);
      this.fullCoverageDetails.pctShare = this.decimal.transform(this.fullCoverageDetails.pctShare,'1.10-10');
  }

  getEditableCov(){
    for(let data of this.passData.tableData){
      data.uneditable = [];
      if(data.discountTag == 'Y'){
        data.uneditable.pop();
      }else if(data.discountTag == 'N' ) {
        data.uneditable.push('premAmt');
      }
    }
  }

  cancel(){
	this.cancelBtn.clickCancel();
  }

  onclickSave(){
  	$('#confirm-save #modalBtn2').trigger('click');
  }
}
