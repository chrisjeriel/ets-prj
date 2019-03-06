import { Component, OnInit, Input,  ViewChild, Output } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders, MtnSectionCovers } from '../../_models';
import { QuotationService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {

  private quotationCoverageInfo: QuotationCoverageInfo;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  editedData: any[] = [];
  deletedData: any[] = [];
  //deletedEditedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  @Input() inquiryFlag: boolean = false;
  

  coverageData: any = {
    currencyCd: null,
    currencyRt: null,
    totalSi: null,
    sectionISi: null,
    sectionIISi: null,
    sectionIIISi: null,
    remarks: null,
    sectionCovers:[],
    createDate:[0,0,0],
    createUser:'Earl',
    //updateDate:[0,0,0],
    updateUser: 'Earl'
  }

  passData: any = {
    tHeader: ['Cover Code','Cover Name','Section','Bullet No','Sum Insured','Add Sl'],
    tableData:[],
    dataTypes: ['text','text','select','text','currency','checkbox'],
    opts: [{ selector: "section", vals: ["I", "II", "III"] }],
    nData: {
      createDate: [0,0,0],
      createUser: "PCPR",
      coverCode:null,
      section:null,
      bulletNo:null,
      sumInsured:null,
      addSi:"N",
      updateDate: [0,0,0],
      updateUser: "PCPR"
    },
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[90,'auto',1,1,200,1,1],
    magnifyingGlass: ['coverCd'],
    uneditable: [false,true,false,false,false,false],
    keys:['coverCd','coverCdAbbr','section','bulletNo','sumInsured','addSi']
  };

  @Input() pageData:any;

  multiSelectHeaderTxt: string = "";
  multiSelectData: any[] = [];
  dataLoaded:boolean = false;
  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null,null);
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


  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,private modalService: NgbModal, private maintenanceService: MaintenanceService) {}

  ngOnInit() {
    this.titleService.setTitle("Quo | Coverage");

    //neco
    if(this.inquiryFlag){
      this.passData.opts = [];
      this.passData.uneditable = [];
      this.passData.magnifyingGlass = [];
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      for(var count = 0; count < this.passData.tHeader.length; count++){
        this.passData.uneditable.push(true);
      }
    }
    //neco end

    

    this.quoteNo = this.quotationInfo.quotationNo.split(/[-]/g)[0]
    for (var i = 1; i < this.quotationInfo.quotationNo.split(/[-]/g).length; i++) {
      this.quoteNo += '-' + parseInt(this.quotationInfo.quotationNo.split(/[-]/g)[i]);
    } 

    this.riskId = this.quotationInfo.riskId;
    this.lineCd = this.quoteNo.split('-')[0];

    
    this.getCoverageInfo();
    this.coverageData.currencyCd = this.quotationInfo.currencyCd;
    this.coverageData.currencyRt = this.quotationInfo.currencyRt;
      
      
  }


  getCoverageInfo(){
    this.quotationService.getCoverageInfo(this.quoteNo,null).subscribe((data: any) => {
      this.table.refreshTable();
        if(data.quotation.project == null){
          this.maintenanceService.getMtnSectionCovers(this.lineCd,this.coverCd).subscribe((data: any) =>{
               for(var i=0; i< data.sectionCovers.length;i++){
                 if(data.sectionCovers[i].defaultTag == 'Y' ){
                   data.sectionCovers[i].sumInsured = 0;
                   this.passData.tableData.push(data.sectionCovers[i]);
                }
              }
              this.passData.tableData = data.sectionCovers;
              this.table.refreshTable();
          });
        }

        if(data.quotation.project !== null){
          this.coverageData = data.quotation.project.coverage;
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
          this.coverageData.totalSi = this.sectionI + this.sectionII + this.sectionIII;

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

      this.table.refreshTable();
    });
  }

// <<<<<<< HEAD
//   saveData(cancelFlag?){
//     this.cancelFlag = cancelFlag !== undefined;
//    this.lineCd      = this.quoteNo.split('-')[0];
//    this.editedData  = [];
//    this.deletedData = [];

//    for (var i = 0 ; this.passData.tableData.length > i; i++) {
//       if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted ){
//           this.editedData.push(this.passData.tableData[i]);
//           this.editedData[this.editedData.length-1].createDate = new Date(this.editedData[this.editedData.length-1].createDate[0],this.editedData[this.editedData.length-1].createDate[1]-1,this.editedData[this.editedData.length-1].createDate[2]).toISOString();
//           this.editedData[this.editedData.length-1].updateDate = new Date(this.editedData[this.editedData.length-1].updateDate[0],this.editedData[this.editedData.length-1].updateDate[1]-1,this.editedData[this.editedData.length-1].updateDate[2]).toISOString();
//           this.editedData[this.editedData.length-1].lineCd     = this.lineCd;
//       }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
//         this.deletedData.push(this.passData.tableData[i]);
//         this.deletedData[this.deletedData.length-1].createDate = new Date(this.deletedData[this.deletedData.length-1].createDate[0],this.deletedData[this.deletedData.length-1].createDate[1]-1,this.deletedData[this.deletedData.length-1].createDate[2]).toISOString();
//         this.deletedData[this.deletedData.length-1].updateDate = new Date(this.deletedData[this.deletedData.length-1].updateDate[0],this.deletedData[this.deletedData.length-1].updateDate[1]-1,this.deletedData[this.deletedData.length-1].updateDate[2]).toISOString();
//         this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
//       }
//     }
//     this.coverageData.createDate          = new Date(this.coverageData.createDate[0],this.coverageData.createDate[1]-1,this.coverageData.createDate[2]).toISOString();
//     //this.coverageData.updateDate          = new Date(this.coverageData.updateDate[0],this.coverageData.updateDate[1]-1,this.coverageData.updateDate[2]).toISOString();
//     this.coverageData.saveSectionCovers   = this.editedData;
//     this.coverageData.deleteSectionCovers = this.deletedData;
//     this.coverageData.quoteId             = this.quotationInfo.quoteId;
//     this.coverageData.projId              = 1;
//     this.coverageData.riskId              = this.riskId;
// =======
// >>>>>>> 5ce730fd79ec9bb8f32258adf36083fbeefa358a

  prepareSaveData(){
    this.lineCd      = this.quoteNo.split('-')[0];
    this.editedData  = [];
    this.deletedData = [];
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
       if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted ){
           this.editedData.push(this.passData.tableData[i]);
           this.editedData[this.editedData.length-1].createDate = new Date(this.editedData[this.editedData.length-1].createDate[0],this.editedData[this.editedData.length-1].createDate[1]-1,this.editedData[this.editedData.length-1].createDate[2]).toISOString();
           this.editedData[this.editedData.length-1].updateDate = new Date(this.editedData[this.editedData.length-1].updateDate[0],this.editedData[this.editedData.length-1].updateDate[1]-1,this.editedData[this.editedData.length-1].updateDate[2]).toISOString();
           this.editedData[this.editedData.length-1].lineCd     = this.lineCd;
       }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].createDate = new Date(this.deletedData[this.deletedData.length-1].createDate[0],this.deletedData[this.deletedData.length-1].createDate[1]-1,this.deletedData[this.deletedData.length-1].createDate[2]).toISOString();
         this.deletedData[this.deletedData.length-1].updateDate = new Date(this.deletedData[this.deletedData.length-1].updateDate[0],this.deletedData[this.deletedData.length-1].updateDate[1]-1,this.deletedData[this.deletedData.length-1].updateDate[2]).toISOString();
         this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
       }
     }
     this.coverageData.createDate          = new Date(this.coverageData.createDate[0],this.coverageData.createDate[1]-1,this.coverageData.createDate[2]).toISOString();
     //this.coverageData.updateDate          = new Date(this.coverageData.updateDate[0],this.coverageData.updateDate[1]-1,this.coverageData.updateDate[2]).toISOString();
     this.coverageData.saveSectionCovers   = this.editedData;
     this.coverageData.deleteSectionCovers = this.deletedData;
     this.coverageData.quoteId             = this.quotationInfo.quoteId;
     this.coverageData.projId              = 1;
     this.coverageData.riskId              = this.riskId;


  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareSaveData();

    if(this.editedData.length < 1 && this.deletedData.length < 1 && this.coverageData.remarks == null){
    }else{
      this.quotationService.saveQuoteCoverage(this.coverageData.quoteId,this.coverageData.projId,this.coverageData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#coverage #successModalBtn').trigger('click');
          } else{
            this.dialogMessage = "";
            this.dialogIcon = "success";
            $('#coverage #successModalBtn').trigger('click');
            this.getCoverageInfo();
           }
      });
    }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  sectionCoversLOV(data){
        $('#sectionCoversLOV #modalBtn').trigger('click');

        //data.tableData = this.passData.tableData;
        this.sectionCoverLOVRow = data.index;
  }

  selectedSectionCoversLOV(data){
    this.passData.tableData[this.sectionCoverLOVRow].coverCd = data.coverCd; 
    this.passData.tableData[this.sectionCoverLOVRow].coverCdAbbr = data.coverCdAbbr;
    this.passData.tableData[this.sectionCoverLOVRow].section = data.section;
    this.passData.tableData[this.sectionCoverLOVRow].bulletNo = data.bulletNo;
    this.passData.tableData[this.sectionCoverLOVRow].edited = true;
  }

  update(event){
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
        this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIISi;
     } else if (this.lineCd == 'EEI'){
       this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIISi + this.coverageData.sectionIIISi;
     } else{
       this.coverageData.totalSi = this.coverageData.sectionISi
     }
     
     this.focusBlur();
  }

  focusBlur() {
    setTimeout(() => {$('.req').focus();$('.req').blur()},0)
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
  $('#confirm-save #modalBtn2').trigger('click');
}
}
