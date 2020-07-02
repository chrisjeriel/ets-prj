import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { FormsModule }   from '@angular/forms';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { DecimalPipe } from '@angular/common'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent, LovComponent } from '@app/_components/common';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';

@Component({
  selector: 'app-pol-sum-insured-open-cover',
  templateUrl: './pol-sum-insured-open-cover.component.html',
  styleUrls: ['./pol-sum-insured-open-cover.component.css']
})
export class PolSumInsuredOpenCoverComponent implements OnInit {
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancel : CancelButtonComponent;
  @ViewChild('shareForm') myForm : any;
  @ViewChild(ModalComponent) mdl : ModalComponent;
  @ViewChild('sectionTable') sectionTable : CustEditableNonDatatableComponent;
  @ViewChild('deductiblesTable') deductiblesTable : CustEditableNonDatatableComponent;
  
  @ViewChild(MtnSectionCoversComponent) secCoversLov: MtnSectionCoversComponent;
  @ViewChild(LovComponent) lov : LovComponent;
  policyId: string;
  coverageInfo:any = {
	currencyCd : '',
	currencyRt : '',
	totalSi : '',
	pctShare : '',
	pctPml : '',
	totalValue : '',

  };
  dialogIcon: string = "";
  dialogMessage: string = "";
  cancelFlag : boolean = false;
  cancelFailed: boolean = false;
  loading: boolean = false;
  firstBlur: boolean = false;
  @Input() policyInfo:any;
  @Input() inqFlag: boolean;

  promptMessage: string = "";
  promptType: string = "";
  line: string = '';
  othersCoverCd:number = 999;
  errorFlag:Boolean = false;

  constructor(private uw: UnderwritingService, private ns: NotesService, private dp: DecimalPipe, public modalService: NgbModal) { }

  ngOnInit() {
  	this.policyId = this.policyInfo.policyIdOc;
    this.line = this.policyInfo.policyNo.split('-')[1];
    console.log(this.line);
  	this.coverageInfo.policyId = this.policyId;
  	this.coverageInfo.updateUser = JSON.parse(window.localStorage.currentUser).username;
  	this.coverageInfo.updateDate = this.ns.toDateTimeString(0);
  	this.fetchData();
    if(this.inqFlag){
      this.passDataSectionCover.uneditable = [];
      for(let i:number=0;i<this.passDataSectionCover.keys.length;i++){
        this.passDataSectionCover.uneditable.push('true');
      }
      this.passDataDeductibles.uneditable = [];
      for(let i:number=0;i<this.passDataDeductibles.keys.length;i++){
        this.passDataDeductibles.uneditable.push('true');
      }
      this.passDataDeductibles.checkFlag = false;
      this.passDataDeductibles.addFlag = false;
      this.passDataDeductibles.editFlag = false;
      this.passDataDeductibles.deleteFlag = false;
      this.passDataSectionCover.deleteFlag = false;
      this.passDataSectionCover.checkFlag = false;
      this.passDataSectionCover.addFlag = false;
      this.passDataSectionCover.editFlag = false;
      this.passDataDeductibles.addFlag = false;
      this.passDataDeductibles.deleteFlag= false;
      this.passDataDeductibles.checkFlag = false;
      this.passDataDeductibles.uneditable = [true,true,true,true,true,true]
      this.passDataDeductibles.tHeaderWithColspan.shift();
      //this.passData2.tHeaderWithColspan.shift();

    }

  }

  fetchData(save?){
  	if(save === undefined){
  		this.loading = true;
  	}
	this.uw.getSumInsOc(this.policyId).subscribe(data=>{
		this.coverageInfo.currencyCd	= data['policyOc'].projectOc.coverageOc.currencyCd;
		this.coverageInfo.currencyRt	= data['policyOc'].projectOc.coverageOc.currencyRt;
		this.coverageInfo.totalSi		= data['policyOc'].projectOc.coverageOc.totalSi;
		this.coverageInfo.pctShare		= data['policyOc'].projectOc.coverageOc.pctShare;
		this.coverageInfo.pctPml		= data['policyOc'].projectOc.coverageOc.pctPml;
		this.coverageInfo.totalValue	= data['policyOc'].projectOc.coverageOc.totalValue;
    this.passDataSectionCover.tableData = data['policyOc'].projectOc.coverageOc.sectionCoversOc;
    this.coverageInfo.riskId = data['policyOc'].projectOc.riskId;
    this.sectionTable.refreshTable();
    this.update({});
		setTimeout(a=>{
			this.loading = false;
      this.firstBlur = true;
			$('[appCurrency]').focus()
			$('[appCurrency]').blur()
			$('[appOtherRates]').focus()
			$('[appOtherRates]').blur()
			$('[appCurrencyRate]').focus()
			$('[appCurrencyRate]').blur()
      this.firstBlur = false;
		},0);
	});
  }

  onrowClick(data){
    console.log(data);
    if(data == null){
      this.passDataDeductibles.disableAdd = true;
      this.passDataDeductibles.tableData = [];
      this.deductiblesTable.refreshTable();
    }else{
      this.passDataDeductibles.disableAdd = false;
      /*this.passDataDeductibles.nData.coverCd = this.table.indvSelect.coverCd;
      this.passDataDeductibles.tableData = data.deductiblesSec;
      this.deductiblesTable.refreshTable();*/
      if(data !== null && data.deductiblesSec !== undefined){
        this.passDataDeductibles.nData.coverCd = data.coverCd
        this.passDataDeductibles.tableData = data.deductiblesSec;
      }else {
        this.passDataDeductibles.tableData = [];
      }
      this.deductiblesTable.refreshTable();
    }
  }


  save(cancelFlag?){
   //  this.cancelFlag = cancelFlag !== undefined;
  	// this.coverageInfo.pctShare = parseFloat(this.coverageInfo.pctShare.toString().split(',').join(''));
  	// this.coverageInfo.totalValue = parseFloat(this.coverageInfo.totalValue.toString().split(',').join(''));
  	// this.coverageInfo.pctPml = this.coverageInfo.pctPml === '' || this.coverageInfo.pctPml === null ? '0': parseFloat(this.coverageInfo.pctPml.toString().split(',').join(''));
  	// this.uw.saveSumInsOC(this.coverageInfo).subscribe((data:any)=>{
   //  	if(data.returnCode == -1){
   //      this.cancelFailed = false;
   //  		this.dialogIcon = 'success';
   //  		this.successDiag.open();
   //  		this.myForm.control.markAsPristine();
   //  		this.fetchData('save');
   //  	}else{
   //  		this.dialogIcon = 'error';
   //  		this.successDiag.open();
   //      if(this.cancelFlag){
   //        this.cancelFailed = true;
   //      }else{
   //        this.cancelFailed = false;
   //      }
   //  	}
  	// })


    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.uw.savePolCoverageOc(this.coverageInfo).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.sectionTable.markAsPristine();
        this.deductiblesTable.markAsPristine();
        this.myForm.control.markAsPristine();
        this.fetchData();
        this.deductiblesTable.refreshTable();
      }
    });
  }

  onClickSave(){
    for( var i= 0; i< this.passDataSectionCover.tableData.length;i++){
      if(this.passDataSectionCover.tableData[i].cumSi < 0 && this.passDataSectionCover.tableData[i].addSi == 'Y'){
        this.errorFlag = true;
      }
    }

    for(let sec of this.passDataSectionCover.tableData){
      for(let ded of sec.deductiblesSec){
        if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
          this.dialogIcon = "error";
          this.successDiag.open();
          return null;
        }
      }
    }

    if(this.coverageInfo.totalSi > parseFloat(this.coverageInfo.totalValue.toString().split(',').join(''))){
      if(['EEI', 'MBI' , 'BPV'].includes(this.line)){
        this.promptMessage = "Max sum insured of the policy exceeded the new replacement value of the project.";
      }else if(['DOS','MLP'].includes(this.line)){
        this.promptMessage = "Max sum insured of the policy exceeded the annual sum insured of the project.";
      }else{
        this.promptMessage = "Max sum insured of the policy exceeded the total contract value of the project.";  
      }
      this.promptType = "totalval";
      this.mdl.open();
    }else if(this.errorFlag){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check Sum Insured.';
      this.successDiag.open();
      this.errorFlag = false;
    }else if(this.coverageInfo.pctShare == 0 || this.coverageInfo.totalValue == 0){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check field values.';
      this.successDiag.open();
    }else {
      this.confirmSave.confirmModal();
    }
    
  }

  onClickCancel(){
	this.cancel.clickCancel();
  }

  cmptShrPct(data){
  	//this.checkTotalValueRange();
    if(data !== 0 ){
      this.coverageInfo.pctShare = (parseFloat(this.coverageInfo.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(10);
      this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
    }else{
      this.coverageInfo.pctShare = 0;
      this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare, '1.10-10');
    }
  	
  }

  cmptValue(data){
  	//this.checkPctShareRange();
    if(data.length !== 0 ){
      this.coverageInfo.totalValue = (parseFloat(this.coverageInfo.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(2);
      this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');
    }else{
      this.coverageInfo.totalValue = 0;
      this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');
    }
  	
  }

  checkPctShareRange(){
  	if(parseFloat(this.coverageInfo.pctShare.toString().split(',').join('')) > parseFloat('100.0000000000')){
  		/*this.coverageInfo.pctShare = parseFloat('100');
  		this.cmptValue(this.coverageInfo.pctShare);
  		this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');*/
      if(!this.firstBlur){
        this.promptMessage = "Share (%) will exceed 100%";
        this.promptType = "pctshare";
        this.mdl.open();
      }
  	}else{
  		this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
  	}
  }

  checkPMLRange(){
  	/*if(parseFloat(this.coverageInfo.pctPml.toString().split(',').join('')) > parseFloat('100.0000000000')){
  		this.coverageInfo.pctPml = parseFloat('100');
  		this.coverageInfo.pctPml = this.dp.transform(this.coverageInfo.pctPml,'1.10-10');
  	}else{
  		this.coverageInfo.pctPml = this.dp.transform(this.coverageInfo.pctPml,'1.10-10');
  	}*/
  }

  checkTotalValueRange(){
  	if(parseFloat(this.coverageInfo.totalValue.toString().split(',').join('')) < parseFloat(this.coverageInfo.totalSi)){
  		/*this.coverageInfo.totalValue = this.coverageInfo.totalSi;
  		this.cmptShrPct(this.coverageInfo.totalValue);
  		this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');*/
      if(!this.firstBlur){
        this.promptMessage = "Max sum insured of the policy exceeded the total contract value of the project.";
        this.promptType = "totalval";
        this.mdl.open();
      }
  	}
  }



  //revision

   passDataSectionCover: any = {
    tHeader: [ "Section","Bullet No","Cover Name",  "Sum Insured", "Rate", "Add SI", "Remarks"],
    tableData:[],
    dataTypes: ['text','text','lovInput','currency',"percent", 'checkbox','text-editor'],
    tabIndexes: [false,false,false,true,true,true,true,true],
    nData: {
      showMG: 1,
      addSi:'N',
      bulletNo:null,
      coverCd:'',
      coverName:null,
      createDateSec: '',
      createUserSec: JSON.parse(window.localStorage.currentUser).username,
      deductiblesSec:[],
      description: null,
      discountTag:'N',
      premRt: null,
      premAmt: null,
      section:null,
      sumInsured:null,
      updateDateSec: '',
      updateUserSec: JSON.parse(window.localStorage.currentUser).username,
      remarks: ''
    },
    pageID: 'sectionCovers',
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[1,1,'auto',150,150,1,'auto'],
    magnifyingGlass: ['description'],
    uneditable:[true,false,false,false,false,false,false,false,false],
    keys:['section','bulletNo','description','sumInsured','premRt','addSi','remarks'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  passDataDeductibles: any = {
        tHeader: ["Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
        dataTypes: ["text","text","text-editor", "percent", "currency"],
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

    hideSectionCoverArray : any[] = [];

    passDataTotalPerSection: any = {
          tHeader: ["Section", "Sum Insured"],
          dataTypes: ["text", "currency"],
          tableData: [["SECTION I",null,null],["SECTION II",null,null],["SECTION III",null,null]],
          keys:['section','sumInsured'],
          uneditable:[true,true],
          pageLength:3,
          widths: [1,'auto']
      };


    update(data){
      if(data.hasOwnProperty('lovInput')) {
        this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});

        data.ev['index'] = data.index;
        data.ev['filter'] = this.hideSectionCoverArray;

        this.secCoversLov.checkCode(data.ev.target.value, data.ev);
      }   

      let sectionISi = 0;
      let sectionIPrem = 0;
      let sectionIISi = 0;
      let sectionIIPrem = 0;
      let sectionIIISi = 0;
      let sectionIIIPrem = 0;
      let totalSi = 0;
      let totalPrem =0;
      for(var i=0; i< this.passDataSectionCover.tableData.length;i++){
        this.passDataSectionCover.tableData[i].premAmt = this.passDataSectionCover.tableData[i].discountTag == 'Y'?  this.passDataSectionCover.tableData[i].premAmt:this.passDataSectionCover.tableData[i].sumInsured * (this.passDataSectionCover.tableData[i].premRt /100 )
        if(this.line == 'CAR' || this.line == 'EAR'){
            if(this.passDataSectionCover.tableData[i].section == 'I' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionISi += this.passDataSectionCover.tableData[i].sumInsured;
                  totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  sectionIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'II' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionIISi += this.passDataSectionCover.tableData[i].sumInsured;
                }  
                   
                  sectionIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'III' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                  totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  sectionIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  totalPrem += this.passDataSectionCover.tableData[i].premAmt;
               }
        }else if(this.line == 'EEI'){
            if(this.passDataSectionCover.tableData[i].section == 'I' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionISi += this.passDataSectionCover.tableData[i].sumInsured;
                  totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  sectionIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  totalPrem += this.passDataSectionCover.tableData[i].premAmt;
             }else if(this.passDataSectionCover.tableData[i].section == 'II' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionIISi += this.passDataSectionCover.tableData[i].sumInsured;
                  totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                } 
                sectionIIPrem += this.passDataSectionCover.tableData [i].premAmt;
                totalPrem += this.passDataSectionCover.tableData[i].premAmt;
             }else if(this.passDataSectionCover.tableData[i].section == 'III' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                  totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                sectionIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                totalPrem += this.passDataSectionCover.tableData[i].premAmt;
             }
        }else {
            if(this.passDataSectionCover.tableData[i].section == 'I' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionISi += this.passDataSectionCover.tableData[i].sumInsured;
                  totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  sectionIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  totalPrem += this.passDataSectionCover.tableData[i].premAmt;
             }else if(this.passDataSectionCover.tableData[i].section == 'II' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionIISi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                 
                sectionIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                totalPrem += this.passDataSectionCover.tableData [i].premAmt;
             }else if(this.passDataSectionCover.tableData[i].section == 'III' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  sectionIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                sectionIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                totalPrem += this.passDataSectionCover.tableData [i].premAmt;
             }
        }
        
      }

      this.passDataTotalPerSection.tableData[0].section = 'SECTION I'
      this.passDataTotalPerSection.tableData[0].sumInsured = sectionISi;
      this.passDataTotalPerSection.tableData[0].premium = sectionIPrem;
      this.passDataTotalPerSection.tableData[1].section = 'SECTION II'
      this.passDataTotalPerSection.tableData[1].sumInsured = sectionIISi;
      this.passDataTotalPerSection.tableData[1].premium = sectionIIPrem;
      this.passDataTotalPerSection.tableData[2].section = 'SECTION III'
      this.passDataTotalPerSection.tableData[2].sumInsured = sectionIIISi;
      this.passDataTotalPerSection.tableData[2].premium = sectionIIIPrem;

      this.coverageInfo.pctShare = (totalSi / parseFloat(this.coverageInfo.totalValue.toString().split(',').join(''))*100);

      this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
      this.coverageInfo.totalSi = totalSi;
      this.coverageInfo.totalPrem = totalPrem;
      this.coverageInfo.sectionISi = sectionISi;
      this.coverageInfo.sectionIISi = sectionIISi;
      this.coverageInfo.sectionIIISi = sectionIIISi;
      this.coverageInfo.sectionIPrem = sectionIPrem;
      this.coverageInfo.sectionIIPrem = sectionIIPrem;
      this.coverageInfo.sectionIIIPrem = sectionIIIPrem;

      this.getEditableCov();


    }

    getEditableCov(){
      for(let data of this.passDataSectionCover.tableData){
        data.uneditable = [];
        if((this.line == 'CAR' && data.coverCd == 56) || (this.line == 'EAR' && data.coverCd == 58)){
          data.uneditable.push('addSi');
        }
        if(data.discountTag == 'N' ) {
            data.uneditable.push('premAmt');
        }
      }
    }

    checkPctShare(){
        if(parseFloat(this.coverageInfo.pctShare.toString().split(',').join('')) > parseFloat('100.0000000000')){
            this.promptMessage = "Share (%) will exceed 100%";
            this.promptType = "pctshare";
            this.mdl.open();
        }else{
          this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
        }
        
      }
    checktotalValue(){
          if(parseFloat(this.coverageInfo.totalValue.toString().split(',').join('')) < this.coverageInfo.totalSi){
            this.promptMessage = "Max sum insured of the policy exceeded the total contract value of the project.";
            this.promptType = "totalval";
            this.mdl.open();
          }
      }


    pctShare(data){
            this.coverageInfo.totalValue = (parseFloat(this.coverageInfo.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(2);
            this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');
        
      }
    totalValue(data){
          this.coverageInfo.pctShare = (parseFloat(this.coverageInfo.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(10);
          this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
        
      }

    sectionCoverLOVRow: any;

    sectionCoversLOV(data){
        this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
        this.secCoversLov.modal.openNoClose()
        this.sectionCoverLOVRow = data.index;
          
    } 

    selectedSectionCoversLOV(data){
          if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
            this.sectionCoverLOVRow = data[0].ev.index;
            this.ns.lovLoader(data[0].ev, 0);
          }
          this.sectionTable.markAsDirty();

          if(data[0].coverCd != '' && data[0].coverCd != null && data[0].coverCd != undefined) {
            //HIDE THE POWERFUL MAGNIFYING GLASS
            this.passDataSectionCover.tableData[this.sectionCoverLOVRow].showMG = 1;
          }
          this.passDataSectionCover.tableData = this.passDataSectionCover.tableData.filter(a=>{return a.showMG !== 1});
          //this.validateSectionCover();
          for(var i = 0; i<data.length;i++){
            this.passDataSectionCover.tableData.push(JSON.parse(JSON.stringify(this.passDataSectionCover.nData)));
            this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].coverCd = data[i].coverCd;
            this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].description = data[i].coverName;
            this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].section = data[i].section;
            this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].bulletNo = data[i].bulletNo;
            this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].edited = true;
            this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].showMG = 0;
          }

          this.passDataSectionCover.tableData.forEach(a=>{
            a.others = a.coverCd == this.othersCoverCd;
          })
          this.sectionTable.refreshTable();
     }


     passLOVData: any = {
       selector : 'deductibles'
     };

     lovRowData:any;
     clickDeductiblesLOV(data){
       if(data.key=="deductibleCd"){
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
         // this.lovRowData.deductibleTitle = data.data.deductibleTitle;
         // this.lovRowData.deductibleRt = data.data.deductibleRate;
         // this.lovRowData.deductibleAmt = data.data.deductibleAmt;
         // this.lovRowData.deductibleTxt = data.data.deductibleText;
         // this.lovRowData.edited = true;
         // this.lovRowData.deductibleCd = data.data.deductibleCd;
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

       prepareData(){
         let editedData = [];
         let deletedData = [];
         let editedDedt = [];
         let deletedDedt = [];
         this.coverageInfo.policyIdOc = this.policyId;
         this.coverageInfo.projId = 1;
         this.coverageInfo.createDate = this.ns.toDateTimeString(this.coverageInfo.createDate);
         this.coverageInfo.updateDate = this.ns.toDateTimeString(this.coverageInfo.updateDate);
         this.coverageInfo.updateUser = this.ns.getCurrentUser();

         for(var i = 0; i < this.passDataSectionCover.tableData.length;i++){
           if(this.passDataSectionCover.tableData[i].edited && !this.passDataSectionCover.tableData[i].deleted){
             editedData.push(this.passDataSectionCover.tableData[i]);

             editedData[editedData.length - 1].lineCd =  this.line;
             editedData[editedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
             editedData[editedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
             editedData[editedData.length - 1].updateUserSec = this.ns.getCurrentUser(); 

           }else if(this.passDataSectionCover.tableData[i].deleted){
             deletedData.push(this.passDataSectionCover.tableData[i]);
             deletedData[deletedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
             deletedData[deletedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
             deletedData[deletedData.length - 1].lineCd = this.line;
             deletedDedt = deletedDedt.concat(deletedData[deletedData.length - 1].deductiblesSec);
           }

           for(var j = 0 ; j < this.passDataSectionCover.tableData[i].deductiblesSec.length;j++){
               if(this.passDataSectionCover.tableData[i].deductiblesSec[j].edited && !this.passDataSectionCover.tableData[i].deductiblesSec[j].deleted){
                 editedDedt.push(this.passDataSectionCover.tableData[i].deductiblesSec[j]);
                 editedDedt[editedDedt.length - 1].createDate = this.ns.toDateTimeString(editedDedt[editedDedt.length - 1].createDate)
                 editedDedt[editedDedt.length - 1].updateDate = this.ns.toDateTimeString(editedDedt[editedDedt.length - 1].updateDate)
                 editedDedt[editedDedt.length - 1].updateUser = this.ns.getCurrentUser(); 
               }else if(this.passDataSectionCover.tableData[i].deductiblesSec[j].deleted){
                 deletedDedt.push(this.passDataSectionCover.tableData[i].deductiblesSec[j]);
               }
           }
         }

         this.coverageInfo.pctShare = parseFloat(this.coverageInfo.pctShare.toString().split(',').join(''));
         this.coverageInfo.totalValue = parseFloat(this.coverageInfo.totalValue.toString().split(',').join(''));
         this.coverageInfo.pctPml = parseFloat(this.coverageInfo.pctPml.toString().split(',').join(''));
         this.coverageInfo.saveSectionCoversOc = editedData;
         this.coverageInfo.delSectionCoversOc = deletedData;
         this.coverageInfo.saveDeductibleList = editedDedt;
         this.coverageInfo.deleteDeductibleList = deletedDedt;
         
         /*this.coverageInfo.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
         this.coverageInfo.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
     */
       }
}
