import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, UnderwritingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-pol-value-coverage',
  templateUrl: './pol-value-coverage.component.html',
  styleUrls: ['./pol-value-coverage.component.css']
})
export class PolValueCoverageComponent implements OnInit {
  
  @ViewChild("sectionTable") sectionTable: CustEditableNonDatatableComponent;
  @ViewChild("deductiblesTable") deductiblesTable: CustEditableNonDatatableComponent;

  passData: any = {
    tHeader:['Section','Bullet No','Cover Name','Sum Insured','Rate(%)','Premium','Sum Insured','Rate','Premium','D/S','Add SI'],
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
        addFlag: true,
        deleteFlag: true,
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
    	currencyCd: null,
    	currencyRt: null,
    	totalSi: null,
    	totalPrem: null,
    	treatyShare: null,
    	pctShare: null,
    	pctPml: null,
    	totalValue: null,
    	remarks: null
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
    line: any = 'CAR';

  constructor( private ns: NotesService, private underwritingService: UnderwritingService) { }


  ngOnInit() {
  		this.passData.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "", span: 3 },
  		  { header: "Original Value", span: 3 }, { header: "100% Value", span: 5 });
  		this.passDataPerSection.tableData = [['SECTION I','',''],['SECTION II','',''],['SECTION III','','']]

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

  	this.underwritingService.getFullCoverage(null,'250').subscribe((data:any) => {
  		console.log(data)
  		if(data.policy.project !== null){
  			var datas = data.policy.project.fullCoverage.fullSecCover;
  			this.fullCoverageDetails = data.policy.project.fullCoverage;
  			for(var i = 0 ; i < datas.length;i++){
  				this.passData.tableData.push(datas[i]);
  				if(this.line == 'CAR' || this.line == 'EAR'){
  					if(datas[i].section == 'I' && datas[i].addSi == 'Y'){
  						this.sectionISi   	+= datas[i].sumInsured;
  						this.sectionIPrem   += datas[i].premAmt;

  						this.totalSi 		+= datas[i].sumInsured;
  						this.totalPrem 		+= datas[i].premAmt;
  					}else if(datas[i].section == 'II' && datas[i].addSi == 'Y'){
  						this.sectionIISi  	+= datas[i].sumInsured;
  						this.sectionIIPrem   += datas[i].premAmt;

  						this.totalPrem		+= datas[i].premAmt;
  					}else if(datas[i].section == 'III' && datas[i].addSi == 'Y'){
  						this.sectionIIISi  	 += datas[i].sumInsured;
  						this.sectionIIIPrem  += datas[i].premAmt;

  						this.totalSi		+= datas[i].sumInsured;
  						this.totalPrem		+= datas[i].premAmt;
  					}
  				}else if(this.line == 'EEI'){
  					if(datas[i].section == 'I' && datas[i].addSi == 'Y'){
  						this.sectionISi   	+= datas[i].sumInsured;
  						this.sectionIPrem   += datas[i].premAmt;

  						this.totalSi 		+= datas[i].sumInsured;
  						this.totalPrem 		+= datas[i].premAmt;
  					}else if(datas[i].section == 'II' && datas[i].addSi == 'Y'){
  						this.sectionIISi  	+= datas[i].sumInsured;
  						this.sectionIIPrem   += datas[i].premAmt;
  						this.totalSi		+= datas[i].sumInsured;

  						this.totalPrem		+= datas[i].premAmt;
  					}else if(datas[i].section == 'III' && datas[i].addSi == 'Y'){
  						this.sectionIIISi  	 += datas[i].sumInsured;
  						this.sectionIIIPrem  += datas[i].premAmt;

  						this.totalSi		+= datas[i].sumInsured;
  						this.totalPrem		+= datas[i].premAmt;
  					}
  				}else {
  					if(datas[i].section == 'I' && datas[i].addSi == 'Y'){
  						this.sectionISi   	+= datas[i].sumInsured;
  						this.sectionIPrem   += datas[i].premAmt;

  						this.totalSi 		+= datas[i].sumInsured;
  						this.totalPrem 		+= datas[i].premAmt;
  					}else if(datas[i].section == 'II' && datas[i].addSi == 'Y'){
  						this.sectionIISi  	+= datas[i].sumInsured;
  						this.sectionIIPrem   += datas[i].premAmt;
  						this.totalSi		+= datas[i].sumInsured;

  						this.totalPrem		+= datas[i].premAmt;
  					}else if(datas[i].section == 'III' && datas[i].addSi == 'Y'){
  						this.sectionIIISi  	 += datas[i].sumInsured;
  						this.sectionIIIPrem  += datas[i].premAmt;

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

  	for(var i = 0; i< this.passData.tableData.length;i++){
  		if(this.line == 'CAR' || this.line == 'EAR'){
  			if(this.passData.tableData[i].section == 'I' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionISi   	+= this.passData.tableData[i].sumInsured;
  				this.sectionIPrem   += this.passData.tableData[i].premAmt;

  				this.totalSi 		+= this.passData.tableData[i].sumInsured;
  				this.totalPrem 		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'II' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionIISi  	+= this.passData.tableData[i].sumInsured;
  				this.sectionIIPrem   += this.passData.tableData[i].premAmt;

  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'III' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionIIISi  	 += this.passData.tableData[i].sumInsured;
  				this.sectionIIIPrem  += this.passData.tableData[i].premAmt;

  				this.totalSi		+= this.passData.tableData[i].sumInsured;
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}
  		}else if(this.line == 'EEI'){
  			if(this.passData.tableData[i].section == 'I' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionISi   	+= this.passData.tableData[i].sumInsured;
  				this.sectionIPrem   += this.passData.tableData[i].premAmt;

  				this.totalSi 		+= this.passData.tableData[i].sumInsured;
  				this.totalPrem 		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'II' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionIISi  	+= this.passData.tableData[i].sumInsured;
  				this.sectionIIPrem   += this.passData.tableData[i].premAmt;
  				this.totalSi		+= this.passData.tableData[i].sumInsured;

  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'III' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionIIISi  	 += this.passData.tableData[i].sumInsured;
  				this.sectionIIIPrem  += this.passData.tableData[i].premAmt;

  				this.totalSi		+= this.passData.tableData[i].sumInsured;
  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}
  		}else {
  			if(this.passData.tableData[i].section == 'I' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionISi   	+= this.passData.tableData[i].sumInsured;
  				this.sectionIPrem   += this.passData.tableData[i].premAmt;

  				this.totalSi 		+= this.passData.tableData[i].sumInsured;
  				this.totalPrem 		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'II' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionIISi  	+= this.passData.tableData[i].sumInsured;
  				this.sectionIIPrem   += this.passData.tableData[i].premAmt;
  				this.totalSi		+= this.passData.tableData[i].sumInsured;

  				this.totalPrem		+= this.passData.tableData[i].premAmt;
  			}else if(this.passData.tableData[i].section == 'III' && this.passData.tableData[i].addSi == 'Y'){
  				this.sectionIIISi  	 += this.passData.tableData[i].sumInsured;
  				this.sectionIIIPrem  += this.passData.tableData[i].premAmt;

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
  }
}
