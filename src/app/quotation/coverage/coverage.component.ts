import { Component, OnInit, Input,  ViewChild, Output, EventEmitter } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders, MtnSectionCovers } from '../../_models';
import { QuotationService, NotesService, MaintenanceService, UserService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {
  @Output() showAlop = new EventEmitter<any>();
  private quotationCoverageInfo: QuotationCoverageInfo;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(MtnSectionCoversComponent) secCoversLov: MtnSectionCoversComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild('infoCov') modal : ModalComponent;
  @Output() enblQuoteOpTab = new EventEmitter<any>();
  @ViewChild(NgForm) remarksForm:NgForm;
  editedData: any[] = [];
  deletedData: any[] = [];
  //deletedEditedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  @Input() inquiryFlag: boolean = false;
  @Output() enblEndtTab = new EventEmitter<any>();
  hideSectionCoverArray: any[] = [];
  initialData: any[]=[];

  coverageData: any = {
    currencyCd: null,
    currencyRt: null,
    totalSi: null,
    sectionISi: null,
    sectionIISi: null,
    sectionIIISi: null,
    remarks: '',
    sectionCovers:[],
    createDate: '',
    createUser:JSON.parse(window.localStorage.currentUser).username,
    //updateDate:[0,0,0],
    updateUser: JSON.parse(window.localStorage.currentUser).username
  }

  passData: any = {
    tHeader: ['Section','Bullet No','Cover Name','Sum Insured','Add Sl', 'Remarks'],
    tableData:[],
    dataTypes: ['text','text','lovInput','currency','checkbox','text-editor'],
    tabIndexes: [false,false,false,true,false],
    nData: {
      showMG: 1,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      coverName:null,
      section:null,
      bulletNo:null,
      sumInsured:null,
      addSi:"N",
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username,
      remarks:''
    },
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[60,90,225,110,1],
    magnifyingGlass: ['coverName'],
    uneditable: [true,false,false,false,false],
    keys:['section','bulletNo','coverName','sumInsured','addSi','remarks'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  @Input() pageData:any;

  multiSelectHeaderTxt: string = "";
  multiSelectData: any[] = [];
  dataLoaded:boolean = false;
  nData: QuotationCoverageInfo = new QuotationCoverageInfo( null, null, null, null,null);
  projId: number;
  riskId: number;
  temp: number = 0;
  sub: any;
  quoteNo:string = '';
  lineCd: string = '';
  coverCd: string = '';
  quoteId: any;
  @Input() quotationInfo: any = {};
  sectionCoverLOVRow: number;
  sectionI: number = 0;
  sectionII: number = 0;
  sectionIII: number = 0;
  totalSi: number = 0;

  dialogMessage:string;
  dialogIcon:string;
  cancelFlag:boolean;
  errorFlag:boolean = false;
  refresh:boolean = true;
  totalValue: number = 0;
  promptMessage: string = "";
  promptType: string = "";

  alopCoverCd:any;

  othersCoverCd:number = 999;

  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,public modalService: NgbModal, private maintenanceService: MaintenanceService, private ns: NotesService, private userService: UserService) {}

  ngOnInit() {
    this.titleService.setTitle("Quo | Coverage");
    this.userService.emitModuleId("QUOTE003");
    //neco
    if(this.inquiryFlag){
      this.passData.opts = [];
      this.passData.uneditable = [];
      this.passData.magnifyingGlass = [];
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.uneditable =  [true,true,true,true,true];
      this.passData.checkFlag = false;
    }
    //neco end

    

    this.quoteNo = this.quotationInfo.quotationNo.split(/[-]/g)[0]
    for (var i = 1; i < this.quotationInfo.quotationNo.split(/[-]/g).length-1; i++) {
      this.quoteNo += '-' + parseInt(this.quotationInfo.quotationNo.split(/[-]/g)[i]);
    } 

    this.riskId = this.quotationInfo.riskId;
    this.lineCd = this.quoteNo.split('-')[0];

    this.maintenanceService.getMtnParameters('N',this.lineCd+'_ALOP').subscribe(a=>{
      this.alopCoverCd = a['parameters'][0] == undefined ? null : a['parameters'][0].paramValueN;
    })

    // this.maintenanceService.getMtnParameters('N',this.lineCd+'_OTHERS').subscribe(a=>{
    //   this.othersCoverCd = a['parameters'][0] == undefined ? null : a['parameters'][0].paramValueN;
    // })

    this.initialData = [];
    this.getCoverageInfo();
    this.coverageData.currencyCd = this.quotationInfo.currencyCd;
    this.coverageData.currencyRt = this.quotationInfo.currencyRt;
  }


  getCoverageInfo(){
    this.quotationService.getCoverageInfo(null,this.quotationInfo.quoteId).subscribe((data: any) => {
      console.log(data)
        if(data.quotation.project == null){
          this.maintenanceService.getMtnSectionCovers(this.lineCd,this.coverCd).subscribe((data: any) =>{
              for(var i=0; i< data.sectionCovers.length;i++){
                if(data.sectionCovers[i].defaultTag == 'Y' ){
                   data.sectionCovers[i].sumInsured = 0;
                   this.passData.tableData.push(data.sectionCovers[i]);
                }
              }
              this.passData.tableData.forEach(a=>{
                a.others = a.coverCd == this.othersCoverCd;
              })
              this.table.refreshTable();
              this.initialData = this.passData.tableData;
          });

        }

        if(data.quotation.project !== null){
          this.coverageData = data.quotation.project.coverage;
          this.totalValue = data.quotation.project.coverage.totalValue == null ? 0:data.quotation.project.coverage.totalValue;
          this.coverageData.remarks = this.coverageData.remarks == null ? '':this.coverageData.remarks;
          for(var i = 0; i < data.quotation.project.coverage.sectionCovers.length; i++){
              if(data.quotation.project.coverage.sectionCovers[i].section == 'I' && data.quotation.project.coverage.sectionCovers[i].addSi == 'Y'){
                this.sectionI = this.sectionI + data.quotation.project.coverage.sectionCovers[i].sumInsured;
              }
              if(data.quotation.project.coverage.sectionCovers[i].section == 'II' && data.quotation.project.coverage.sectionCovers[i].addSi == 'Y'){
                this.sectionII = this.sectionII + data.quotation.project.coverage.sectionCovers[i].sumInsured;
              }
              if(data.quotation.project.coverage.sectionCovers[i].section == 'III' && data.quotation.project.coverage.sectionCovers[i].addSi == 'Y'){
                this.sectionIII = this.sectionIII + data.quotation.project.coverage.sectionCovers[i].sumInsured;
              }
          }
          this.coverageData.sectionISi = this.sectionI;
          this.coverageData.sectionIISi = this.sectionII;
          this.coverageData.sectionIIISi = this.sectionIII;
          if(this.lineCd == 'CAR' || this.lineCd == 'EAR'){
             this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIIISi;
          } else if (this.lineCd == 'EEI'){
            this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIISi + this.coverageData.sectionIIISi;
          } else{
            this.coverageData.totalSi = this.coverageData.sectionISi
          }
 
          setTimeout(() => {
            this.focusBlur();
          }, 0)
        }

        if(data.quotation.project !== null ){
          for (var i = 0; i < data.quotation.project.coverage.sectionCovers.length; i++) {
            this.passData.tableData.push(data.quotation.project.coverage.sectionCovers[i]);
          }
          this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        }

          setTimeout(() => {
            this.focusBlur();
          }, 0)

      this.passData.tableData.forEach(a=>{
        a.others = a.coverCd == this.othersCoverCd;
      })
      this.table.refreshTable();
      
    });

  }

  getCoverage(){
      this.quotationService.getCoverageInfo(null,this.quotationInfo.quoteId).subscribe((data: any) => {
      this.table.refreshTable();

        if(data.quotation.project !== null){
          this.coverageData = data.quotation.project.coverage;
          this.totalValue   = data.quotation.project.coverage.totalValue == null? 0:data.quotation.project.coverage.totalValue;
          this.coverageData.remarks = this.coverageData.remarks == null ? '':this.coverageData.remarks;
        }

        if(data.quotation.project !== null ){
          for (let row of  data.quotation.project.coverage.sectionCovers) {
            row.others = row.coverCd == this.othersCoverCd;
            this.passData.tableData.push(row);
          }
          this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        }
          setTimeout(() => {
            this.focusBlur();
          }, 0)

          this.table.refreshTable();
        });
  }

  validateSectionCover(){
      this.quotationService.getCoverageInfo(null,this.quotationInfo.quoteId).subscribe((data: any) => {
        if(data.quotation.project != null){
          var matches = false;
          var UpdatedDatas = this.passData.tableData;
          var InitialDatas = data.quotation.project.coverage.sectionCovers;
          for(var i=0;i<InitialDatas.length;i++){
            for(var j=0;j<UpdatedDatas.length;j++){
               if(InitialDatas[i].coverCd == UpdatedDatas[j].coverCd){
                 matches = true;
                 break;
              }
            }
            if(!matches){
              this.deletedData.push(InitialDatas[i])
              this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].createDate);
              this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].updateDate);
              this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
            }
            matches = false;
          }
        }
      });
  }


  prepareSaveData(){
    this.lineCd      = this.quoteNo.split('-')[0];
    /*this.editedData  = [];
    this.deletedData = [];*/
    if(this.initialData.length > 0){
      for (var i = 0 ; this.passData.tableData.length > i; i++) {
          if( !this.passData.tableData[i].deleted ){
               this.editedData.push(this.passData.tableData[i]);
               this.editedData[this.editedData.length-1].createDate = this.ns.toDateTimeString(this.editedData[this.editedData.length-1].createDate) ;
               this.editedData[this.editedData.length-1].updateDate = this.ns.toDateTimeString(this.editedData[this.editedData.length-1].updateDate);
               this.editedData[this.editedData.length-1].lineCd     = this.lineCd;
               this.editedData[this.editedData.length -1].coverName = this.passData.tableData[i].coverName
               this.editedData[this.editedData.length-1].updateUser     = this.ns.getCurrentUser();
          }else if(this.passData.tableData[i].deleted){
             this.deletedData.push(this.passData.tableData[i]);
             this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].createDate);
             this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].updateDate);
             this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
         }
       }
       this.coverageData.createDate          = this.ns.toDateTimeString(this.coverageData.createDate);
       this.coverageData.updateDate          = this.ns.toDateTimeString(this.coverageData.updateDate);
       this.coverageData.saveSectionCovers   = this.editedData;
       this.coverageData.deleteSectionCovers = this.deletedData;
       this.coverageData.quoteId             = this.quotationInfo.quoteId;
       this.coverageData.projId              = 1;
       this.coverageData.riskId              = this.riskId;
       this.coverageData.updateUser          = this.ns.getCurrentUser();
    }else {
        for (var i = 0 ; this.passData.tableData.length > i; i++) {
           if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted ){
               this.editedData.push(this.passData.tableData[i]);
               this.editedData[this.editedData.length-1].createDate = this.ns.toDateTimeString(this.editedData[this.editedData.length-1].createDate) ;
               this.editedData[this.editedData.length-1].updateDate = this.ns.toDateTimeString(this.editedData[this.editedData.length-1].updateDate);
               this.editedData[this.editedData.length-1].lineCd     = this.lineCd;
               this.editedData[this.editedData.length-1].updateUser     = this.ns.getCurrentUser();
           }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
             this.deletedData.push(this.passData.tableData[i]);
             this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].createDate);
             this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].updateDate);
             this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
             this.deletedData[this.deletedData.length-1].updateUser     = this.ns.getCurrentUser();
           }
         }
         this.coverageData.createDate          = this.ns.toDateTimeString(this.coverageData.createDate);
         this.coverageData.updateDate          = this.ns.toDateTimeString(this.coverageData.updateDate);
         this.coverageData.saveSectionCovers   = this.editedData;
         this.coverageData.deleteSectionCovers = this.deletedData;
         this.coverageData.quoteId             = this.quotationInfo.quoteId;
         this.coverageData.projId              = 1;
         this.coverageData.riskId              = this.riskId;
         this.coverageData.updateUser          = this.ns.getCurrentUser();
    }
    
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;

    for (var i =0; i < this.passData.tableData.length;i++){
      if(this.passData.tableData[i].sumInsured == 0  && this.passData.tableData[i].addSi == 'Y' && !this.passData.tableData[i].deleted){
        this.errorFlag = true;
      }
    }

    if(this.errorFlag){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check Sum Insured.';
      this.successDiag.open();
      return;
    }
    this.prepareSaveData();
      this.quotationService.saveQuoteCoverage(this.coverageData.quoteId,this.coverageData.projId,this.coverageData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDiag.open();
          } else{
            this.dialogMessage = "";
            this.dialogIcon = "success";
            this.successDiag.open();
            this.getCoverage();
            this.table.markAsPristine();
            this.initialData = [];
            this.editedData = [];
            this.deletedData =[];
            this.enblEndtTab.emit(true);
            if(this.lineCd == 'CAR' || this.lineCd == 'EAR' ){
              this.getQuoteOptions();
            }
            this.remarksForm.control.markAsPristine();
            //this.getCoverageInfo();
           }
      });
  }

  testing(){
    this.quotationService.getCoverageInfo(this.quoteNo,null).subscribe((data: any) => {

    });
  }
  cancel(){
      this.cancelBtn.clickCancel();
  }
  
  sectionCoversLOV(data){
        this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
        $('#sectionCoversLOV #modalBtn').trigger('click');
        //data.tableData = this.passData.tableData;
        this.sectionCoverLOVRow = data.index;
  }

  selectedSectionCoversLOV(data){
    console.log(data)
    if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
      this.sectionCoverLOVRow = data[0].ev.index;
      this.ns.lovLoader(data[0].ev, 0);
    }

    $('#cust-table-container').addClass('ng-dirty');

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
      this.passData.tableData[this.passData.tableData.length - 1].sumInsured = 0;
      this.passData.tableData[this.passData.tableData.length - 1].addSi = data[i].addSi;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;

      //HIDE THE POWERFUL MAGNIFYING GLASS
      if(data[i].coverCd!== ""){
        this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      }
      if(this.othersCoverCd === data[i].coverCd) {
         this.passData.tableData[this.passData.tableData.length - 1].others = true;
      }
    }
    this.table.refreshTable();
  }

  update(data){
    if(data.hasOwnProperty('lovInput')) {
      this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});

      data.ev['index'] = data.index;
      data.ev['filter'] = this.hideSectionCoverArray;

      this.secCoversLov.checkCode(data.ev.target.value, data.ev);
    }    

      this.lineCd = this.quoteNo.split('-')[0];
      this.coverageData.sectionISi =0;
      this.coverageData.sectionIISi =0;
      this.coverageData.sectionIIISi =0;
      
      for(var i= 0; i< this.passData.tableData.length; i++){
         if(this.passData.tableData[i].addSi == 'Y' && !this.passData.tableData[i].deleted){
           if(this.passData.tableData[i].section == 'I'){
             this.coverageData.sectionISi += this.passData.tableData[i].sumInsured;
             
           }
           if(this.passData.tableData[i].section == 'II'){
             this.coverageData.sectionIISi += this.passData.tableData[i].sumInsured;
           }
           if(this.passData.tableData[i].section == 'III'){
             this.coverageData.sectionIIISi += this.passData.tableData[i].sumInsured;
           }

         }
      }

     if(this.lineCd == 'CAR' || this.lineCd == 'EAR'){
        this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIIISi;
     } else if (this.lineCd == 'EEI'){
       this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIISi + this.coverageData.sectionIIISi;
     } else{
       this.coverageData.totalSi = this.coverageData.sectionISi
     }
     
     if((this.totalValue !== 0) && (this.coverageData.totalSi > this.totalValue)){
         this.promptMessage = "Total Sum Insured of the Quotation exceeded the Total Contract Value of the Project.";
         this.promptType = "totalval";
         this.modal.open();
     } 
     //this.focusBlur();
     this.validateSectionCover();
     //this.cancel();  
  }

  focusBlur() {
    //setTimeout(() => {$('.req').focus();$('.req').blur()},0)
  }

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
  }

  setCurrency(data){
    this.coverageData.currencyCd = data.currencyAbbr;
    this.coverageData.currencyRt = data.currencyRt;
    this.focusBlur();
  }

  onClickSave(){
      for (var i =0; i < this.passData.tableData.length;i++){
         if(this.passData.tableData[i].sumInsured == 0  && this.passData.tableData[i].addSi == 'Y' && !this.passData.tableData[i].deleted){
           this.errorFlag = true;
         }
       }
       if(this.errorFlag){
         this.dialogIcon = 'error-message';
         this.dialogMessage = 'Please check Sum Insured.';
         this.successDiag.open();
         this.errorFlag = false;
       }else {
          $('#confirm-save #modalBtn2').trigger('click');
      }
  }

  getQuoteOptions(){
      this.quotationService.getQuoteOptions(this.coverageData.quoteId ,'').subscribe(data => {
         let alopFlag = false;
         if(data['quotation'] !== null)
         first:for(let option of data['quotation'].optionsList){
           for(let otherRate of option.otherRatesList){
             if(otherRate.section == 'III' && otherRate.coverCd == this.alopCoverCd){
               alopFlag = true;
               break first;
             }
           }
         }
         this.showAlop.emit(alopFlag);
      });

  } 

}
