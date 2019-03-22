import { Component, OnInit, Input,  ViewChild, Output } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders, MtnSectionCovers } from '../../_models';
import { QuotationService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';

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
  @ViewChild(MtnSectionCoversComponent) secCoversLov: MtnSectionCoversComponent;

  editedData: any[] = [];
  deletedData: any[] = [];
  //deletedEditedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  @Input() inquiryFlag: boolean = false;
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
    createUser:'Earl',
    //updateDate:[0,0,0],
    updateUser: 'Earl'
  }

  passData: any = {
    tHeader: ['Section','Bullet No','Cover Name','Sum Insured','Add Sl'],
    tableData:[],
    dataTypes: ['text','text','text','currency','checkbox'],
    nData: {
      createDate: '',
      createUser: "PCPR",
      coverCode:null,
      section:null,
      bulletNo:null,
      sumInsured:null,
      addSi:"N",
      updateDate: '',
      updateUser: "PCPR"
    },
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[60,90,225,110,1],
    magnifyingGlass: ['coverCdAbbr'],
    uneditable: [true,false,false,false,false],
    keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
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

  refresh:boolean = true;


  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,private modalService: NgbModal, private maintenanceService: MaintenanceService, private ns: NotesService) {}

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
    for (var i = 1; i < this.quotationInfo.quotationNo.split(/[-]/g).length-1; i++) {
      this.quoteNo += '-' + parseInt(this.quotationInfo.quotationNo.split(/[-]/g)[i]);
    } 

    this.riskId = this.quotationInfo.riskId;
    this.lineCd = this.quoteNo.split('-')[0];

    this.initialData = [];
    this.getCoverageInfo();
    this.coverageData.currencyCd = this.quotationInfo.currencyCd;
    this.coverageData.currencyRt = this.quotationInfo.currencyRt;
  }


  getCoverageInfo(){
    this.quotationService.getCoverageInfo(null,this.quotationInfo.quoteId).subscribe((data: any) => {
      this.table.refreshTable();
        if(data.quotation.project == null){
          this.maintenanceService.getMtnSectionCovers(this.lineCd,this.coverCd).subscribe((data: any) =>{
              for(var i=0; i< data.sectionCovers.length;i++){
                if(data.sectionCovers[i].defaultTag == 'Y' ){
                   data.sectionCovers[i].sumInsured = 0;
                   this.passData.tableData.push(data.sectionCovers[i]);
                }
              }
              this.table.refreshTable();
              this.initialData = this.passData.tableData;
          });

        }

        if(data.quotation.project !== null){
          this.coverageData = data.quotation.project.coverage;
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

  getCoverage(){
      this.quotationService.getCoverageInfo(null,this.quotationInfo.quoteId).subscribe((data: any) => {
      this.table.refreshTable();

        if(data.quotation.project !== null){
          this.coverageData = data.quotation.project.coverage;
          this.coverageData.remarks = this.coverageData.remarks == null ? '':this.coverageData.remarks;
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

  validateSectionCover(){
// start 409bcd104319b697dc6e7c9fa7a47ac0bd67880f
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
// END 409bcd104319b697dc6e7c9fa7a47ac0bd67880f
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
    }else {
        for (var i = 0 ; this.passData.tableData.length > i; i++) {
           if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted ){
               this.editedData.push(this.passData.tableData[i]);
               this.editedData[this.editedData.length-1].createDate = this.ns.toDateTimeString(this.editedData[this.editedData.length-1].createDate) ;
               this.editedData[this.editedData.length-1].updateDate = this.ns.toDateTimeString(this.editedData[this.editedData.length-1].updateDate);
               this.editedData[this.editedData.length-1].lineCd     = this.lineCd;
           }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
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
    }
    
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareSaveData();
    /*if (this.editedData.length != 0 || this.deletedData.length!=0 || this.initialData.length != 0) {*/
      this.quotationService.saveQuoteCoverage(this.coverageData.quoteId,this.coverageData.projId,this.coverageData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#successModalBtn').trigger('click');
          } else{
            this.dialogMessage = "";
            this.dialogIcon = "success";
            $('#successModalBtn').trigger('click');
            this.getCoverage();
            this.table.markAsPristine();
            this.initialData = [];
            this.editedData = [];
            this.deletedData =[];
            //this.getCoverageInfo();
           }
      });
/*    }else{
        this.dialogMessage = "Nothing to save.";
        this.dialogIcon = "info"
        $('#successModalBtn').trigger('click');
    }*/
  }

  testing(){
    this.quotationService.getCoverageInfo(this.quoteNo,null).subscribe((data: any) => {

    });
  }
  cancel(){
    //this.cancelBtn.clickCancel();
    var matches = false;

      this.quotationService.getCoverageInfo(this.quoteNo,null).subscribe((data: any) => {
        var tableData = this.passData.tableData;
        var previousData = data.quotation.project.coverage.sectionCovers;

        for(var i=0;i<previousData.length;i++){
          for(var j=0;j<tableData.length;j++){
             if(previousData[i].coverCd == tableData[j].coverCd){
               matches = true;
               break;
            }
          }
          if(!matches){
            this.deletedData.push(previousData[i])
            this.deletedData[this.deletedData.length-1].createDate = new Date(this.deletedData[this.deletedData.length-1].createDate[0],this.deletedData[this.deletedData.length-1].createDate[1]-1,this.deletedData[this.deletedData.length-1].createDate[2]).toISOString();
            this.deletedData[this.deletedData.length-1].updateDate = new Date(this.deletedData[this.deletedData.length-1].updateDate[0],this.deletedData[this.deletedData.length-1].updateDate[1]-1,this.deletedData[this.deletedData.length-1].updateDate[2]).toISOString();
            this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
          }
          matches = false;
        }
      });

    
  }
  
  sectionCoversLOV(data){
        this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
        $('#sectionCoversLOV #modalBtn').trigger('click');
        //data.tableData = this.passData.tableData;
        this.sectionCoverLOVRow = data.index;
  }

  selectedSectionCoversLOV(data){
    this.ns.lovLoader(data.ev, 0);

    /*console.log(data.hasOwnProperty('fromLOV'));
    if(!data.hasOwnProperty('fromLOV')) {
      console.log("hasOwnProperty");
      this.sectionCoverLOVRow = data.ev.index;

    }*/
    
    if (data[0].singleSearchLov) {
      this.sectionCoverLOVRow = data[0].ev.index;
      this.ns.lovLoader(data[0].ev, 0);
    }


    $('#cust-table-container').addClass('ng-dirty');
    this.passData.tableData[this.sectionCoverLOVRow].coverCd = data[0].coverCd; 
    this.passData.tableData[this.sectionCoverLOVRow].coverCdAbbr = data[0].coverCdAbbr;
    this.passData.tableData[this.sectionCoverLOVRow].section = data[0].section;
    this.passData.tableData[this.sectionCoverLOVRow].bulletNo = data[0].bulletNo;
    this.passData.tableData[this.sectionCoverLOVRow].sumInsured = 0;
    this.passData.tableData[this.sectionCoverLOVRow].edited = true;
    //this.validateSectionCover();
    for(var i = 1; i<data.length;i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].coverCd = data[i].coverCd; 
      this.passData.tableData[this.passData.tableData.length - 1].coverCdAbbr = data[i].coverCdAbbr;
      this.passData.tableData[this.passData.tableData.length - 1].section = data[i].section;
      this.passData.tableData[this.passData.tableData.length - 1].bulletNo = data[i].bulletNo;
      this.passData.tableData[this.passData.tableData.length - 1].sumInsured = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      console.log(this.passData.tableData);
    }
    this.table.refreshTable();
    
    /*setTimeout(() => {
      $('#2').find("input:text").focus();
      console.log("Focused.");
    }, 3000);*/
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
       this.coverageData.totalSi = this.coverageData.sectionISi + this.coverageData.sectionIISi;
     } else{
       this.coverageData.totalSi = this.coverageData.sectionISi
     }
     
     this.focusBlur();
     this.validateSectionCover();
     //this.cancel();  
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
