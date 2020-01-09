import { Component, OnInit , ViewChild, Input, ViewChildren, QueryList} from '@angular/core';
import { QuotationInfo, QuotationOption, QuoteEndorsement , QuoteEndorsementOC} from '../../_models';
import { QuotationService, UnderwritingService, MaintenanceService, UserService, NotesService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
//import { LovComponent } from '@app/_components/common';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
    selector: 'app-quote-endorsement',
    templateUrl: './quote-endorsement.component.html',
    styleUrls: ['./quote-endorsement.component.css']
})
export class QuoteEndorsementComponent implements OnInit {
    @Input() endorsementType: string = "";
    @Input() inquiryFlag: boolean = false;
    @Input() quotationInfo: {
        quoteId: '',
        quotationNo: '',
        riskName: '',
        insuredDesc: '',
        statusDesc: ''
    }
    @Input() ocQuoteData: any = {};
    @ViewChild('endorsment') table: CustEditableNonDatatableComponent;
    @ViewChildren(CustNonDatatableComponent) tableNonEditable: QueryList<CustNonDatatableComponent>;
    @ViewChild('copyTable') tableCopy: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild("deductibleTable") deductibleTable: CustEditableNonDatatableComponent;
    @ViewChild(CustNonDatatableComponent) optionTable: CustNonDatatableComponent;
    @ViewChild('deductiblesModal') deductiblesModal : ModalComponent;
    @ViewChild(LovComponent) lov :LovComponent;

/*    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;*/
    OpenCover: boolean;
    private sub: any;
    from: string;
    quotationNum: string;
    quoteNoData: any;
    quoteNoOc: any;
    insured: any;
    projectData: any;
    riskName: any;
    endorsementsData: any[] = [];
    // private quotationInfo: QuotationInfo;
    private quoteEndorsement: QuoteEndorsement;
    dtOptions: DataTables.Settings = {};

    quoteOptionTableData: any[] = [];
    quoteOptionTHeader: any[] = ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'];
    quoteOptionDataType: any[] = ['text', 'percent', 'text', 'percent', 'percent', 'percent', 'percent'];
    quoteOptionNData: QuotationOption = new QuotationOption(null, null, null, null, null, null);
    quoteOptionMagnifyingGlass: any[] = ['conditions'];
    quoteOptionEdited: QuotationOption[] = [];

    tableData: any[] = [];
    tHeader: any[] = ['Endt Code', 'Endt Title', 'Endt Description', 'Remarks'];
    magnifyingGlass: any[] = ["endtCode"]
    nData: QuoteEndorsement = new QuoteEndorsement(null, null, null, null);

    optionNos: number[] = [];
    optionRecords: any[] = [];
    cancelFlag: boolean;

    saveEndt: any = {
        quoteId: '',
        optionId: '',
        createDate: '',
        createUser: '',
        updateUser: ''
    }

    quoteId:string;
    quoteIdOc:string;

    opId:string;
    line:string;

    quoteOptionsData: any = {
        tableData: [],
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        dataTypes: ['text', 'percent', 'text', 'percent', 'percent', 'percent', 'percent'],
        resizable: [false, false, true, false, false, false],
        pagination: true,
        pageStatus: true,
        tableOnly: true,
        pageLength: 3,
        keys: ['optionId','optionRt','condition','commRtQuota','commRtSurplus','commRtFac']
    } 

    endorsementData: any = {
        tableData: [],
        tHeader: ['Endt Code', 'Endt Title', 'Remarks'],
        dataTypes: ['text', 'text', 'text'],
        magnifyingGlass: ['endtCd'],
        nData:  {
          //createDate: [0, 0, 0, 0, 0, 0, 0],
          createUser: this.ns.getCurrentUser(),
          deductiblesList: [],
          defaultTag: "Y",
          description: "",
          endtCd: null,
          endtText01: "",
          endtText02: null,
          endtText03: null,
          endtText04: null,
          endtText05: null,
          endtText06: null,
          endtText07: null,
          endtText08: null,
          endtText09: null,
          endtText10: null,
          endtText11: null,
          endtText12: null,
          endtText13: null,
          endtText14: null,
          endtText15: null,
          endtText16: null,
          endtText17: null,
          endtTitle: "",
          lineCd: "",
          lineDesc: "",
          remarks: null,
          //updateDate: [0, 0, 0, 0, 0, 0, 0],
          updateUser: this.ns.getCurrentUser(),
          showMG : 1
        },
        checkFlag: true,
        addFlag: true,//this.quotationInfo.statusDesc.toUpperCase() !== 'APPROVED',// addFlag: true,
        deleteFlag: true,//!this.inquiryFlag,// deleteFlag: true,
        searchFlag: true,
        uneditable: [true, true, false],
        keys: ['endtCd','endtTitle','remarks'],
        pageLength: 'unli-10',
        // paginateFlag: true,
        infoFlag: true
    }

    endorsementOCData: any = {
        tableData: [],
        tHeader: ['Endt Code', 'Endt Title', 'Endt Description', 'Remarks'],
        magnifyingGlass: ['endtCode'],
        nData: {},
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        infoFlag: true,
        paginateFlag: true,
        searchFlag: true,
        keys: ['endtCode','endtTitle','description','remarks']
    }

    //neco
    copyEndtTable: any = {
        tableData: [],
        tHeader: ['Copy to Option No'],
        dataTypes: ['text'],
        pagination: true,
        pageStatus: true,
        paginateFlag: true,
        infoFlag: true,
        tableOnly: true,
        checkFlag: true,
        pageLength: 5,
        pageID: 'copyEndtTable',
        keys: ['optionNo'],
        uneditable: [true],
    } 

    currentSelectedOption: number;
    copyEndtParams: any[] = [];
    copyEndtOkBtn: boolean = false;
    //end neco

    endtCodeLOVRow : number;
    cancelLink:string;

    deductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code','Deductible Title', 'Deductible Text', 'Deductible (%)', 'Deductible Amount'],
        dataTypes: ['text','text', 'text', 'percent', 'currency','currency'],
        nData:{
            //createDate: [2019, 2, 21, 0, 0, 0, 0],
            createUser: this.ns.getCurrentUser(),
            deductibleAmt: null,
            deductibleCd: null,
            deductibleRt: null,
            deductibleTitle: null,
            deductibleTxt: null,
            optionId: null,
            //updateDate: [2019, 2, 21, 0, 0, 0, 0],
            updateUser: this.ns.getCurrentUser(),
            sumInsured: 0,
            endtCd: 0,
            coverCd: 0,
            showMG: 1
        },
        pageLength: 10,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        searchFlag: true,
        pageID: 2,
        keys: ['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        widths: [60,'auto',100,120,'auto'],
        uneditable: [true,true],
        magnifyingGlass: ['deductibleCd'],
        disableAdd: true
    }
    showModal:boolean = false;
    dialogIcon: string;
    dialogMessage: string;
    hideEndt: any[];
    selectedEndt:any = null;

    constructor(private quotationService: QuotationService, public modalService: NgbModal, private titleService: Title, 
     private route: ActivatedRoute, private uwService: UnderwritingService, private mtnService : MaintenanceService, private userService: UserService,
     private ns: NotesService) { }

    ngOnInit() {  
        if(this.OpenCover){
          this.cancelLink = '/open-cover-processing';
        }else{
          this.cancelLink = '/quotation-processing';
        }
        console.log(this.quotationInfo.quoteId)
        this.quoteId = this.quotationInfo.quoteId;

        // setTimeout(()=>{
        //     $('#endorsmentTable button').attr("disabled","disabled");
        //   },0)

        this.titleService.setTitle("Quo | Endorsements");
        this.userService.emitModuleId("QUOTE005");
        //neco
        if(this.inquiryFlag){
          this.endorsementData.opts = [];
          this.endorsementData.uneditable = [];
          this.endorsementData.magnifyingGlass = [];
          this.endorsementData.addFlag = false;
          this.endorsementData.deleteFlag = false;
          this.endorsementData.checkFlag = false;
          for(var count = 0; count < this.endorsementData.tHeader.length; count++){
            this.endorsementData.uneditable.push(true);
          }
          this.deductiblesData.addFlag = false;
          this.deductiblesData.checkFlag = false;
          this.deductiblesData.deleteFlag = false;
        }
        //neco end
        this.sub = this.route.params.subscribe(params => {
            this.from = params['from'];
      
            if (this.from === "oc-processing") {
              
            }
          });


        this.dtOptions = {
            ordering: false,
            pagingType: 'simple_numbers',
            lengthChange: false,
            searching: false,
            info: false,
        };
        this.optionNos = this.quotationService.getQuoteOptionNos();
              this.OpenCover= false;

              this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                    if (this.from == "quo-processing") {
                        this.quotationNum = params['quotationNo'];
                    }


               });

                if (this.quotationService.toGenInfo[0] == "edit") {                  
                    this.quotationService.getQuoteGenInfo(null,this.plainQuotationNo(this.quotationInfo.quotationNo)).subscribe((data: any) => {
                        // this.insured = data.quotationGeneralInfo.insuredDesc; 
                        // this.quoteNoData = data.quotationGeneralInfo.quotationNo;
                        if(data.project == null){
                             this.riskName = null;
                        } else {
                            this.riskName = data.project.riskName; 
                        }
                        //this.quoteId = data.quotationGeneralInfo.quoteId.toString();
                    });

                    this.line = (this.quotationInfo.quotationNo.split("-")[0]).trim();
                    var id = this.quotationInfo.quoteId == '' ? '' : this.quotationInfo.quoteId;
                    this.quotationService.getQuoteOptions(id, '').subscribe((data: any) => {
                        // this.optionRecords = data.QuotationOption.optionsList; this.plainQuotationNo(this.quotationNum)
                         if (data['quotation'] == null || data['quotation'] == undefined ){
                         }else{
                            // for(var i = data.quotation.optionsList.length - 1; i >= 0; i--){
                              for(var i = 0; i < data.quotation.optionsList.length; i++){
                               this.quoteOptionsData.tableData.push(new QuotationOption (
                                                            data.quotation.optionsList[i].optionId,
                                                            data.quotation.optionsList[i].optionRt,
                                                            data.quotation.optionsList[i].condition,
                                                            data.quotation.optionsList[i].commRtQuota,
                                                            data.quotation.optionsList[i].commRtSurplus,
                                                            data.quotation.optionsList[i].commRtFac));
                            }
                            
                         }
                       this.tableNonEditable.forEach(table => {table.refreshTable()});
                            this.table.refreshTable();
                       //this.optionTable.onRowClick(null,this.quoteOptionsData.tableData[0]);
                    });
                }  

        //this.getDefaultEndorsements();
    }

    //nec

    copyEndtRowClick(data){
      this.copyEndtOkBtn = this.tableCopy.selected.length != 0;
      // if(data === null){
      //     this.copyEndtOkBtn = false;
      // }else{
      //     this.copyEndtOkBtn = data.checked;
      // }
    }

    copyEndtMethod(optionId: number){
      this.currentSelectedOption = optionId;
      this.copyEndtTable.tableData = [];
        for(var i of this.quoteOptionsData.tableData){
            if(optionId !== i.optionId){
              this.copyEndtTable.tableData.push({optionNo: i.optionId})
            }
        }
        this.tableCopy.refreshTable();
    }


    beginCopyEndt(){
      this.copyEndtParams = [];
      for(var j of this.copyEndtTable.tableData){
        if(j.checked){
          this.copyEndtParams.push({optionNo: j.optionNo});
        }
      }
      let params: any = {
        newQuoteId: this.quotationInfo.quoteId,
        quoteId: this.quotationInfo.quoteId,
        copyingType: 'copyEndt',
        fromOptionNo: this.currentSelectedOption,
        toOptionNo: this.copyEndtParams,
        createUser: this.ns.getCurrentUser(),
        createDate: this.ns.toDateTimeString(0),
        updateUser: this.ns.getCurrentUser(),
        updateDate: this.ns.toDateTimeString(0),
      }

      this.quotationService.copyEndorsement(JSON.stringify(params)).subscribe((data: any) =>{
          console.log(data);
          if(data.returnCode==-1){
            this.dialogIcon = 'success-message';
            this.dialogMessage = 'Endorsements were successfully copied.';
            this.table.markAsPristine();
            $('#quote-endorsment #successMdl > #modalBtn').trigger('click');
          }else{
            this.dialogIcon = 'error';
            $('#quote-endorsment #successMdl > #modalBtn').trigger('click');
          }
      });

    }
    //end neco


    clickRow(event) {
/*           this.quotationService.getEndorsements(null,this.quotationNum,event.optionNo).subscribe((data: any) => {*/
   console.log(event)
    if(event.optionId !== undefined){
     //neco
       this.copyEndtMethod(event.optionId);
       this.updateDed(null);
     //end neco
     this.endorsementData.disableAdd = false;
     this.table.loadingFlag = true;
      this.opId = event.optionId;
       this.quotationService.getEndorsements(this.quotationInfo.quoteId,'',event.optionId).subscribe((data: any) => {
             while(this.endorsementData.tableData.length > 0) {
              this.endorsementData.tableData.pop();
            }    
            for(var lineCount = 0; lineCount < data.endorsements.length; lineCount++){
                          this.endorsementData.tableData.push(
                                                          // new QuoteEndorsement(
                                                          //          data.endorsements[lineCount].endtCd, 
                                                          //          data.endorsements[lineCount].endtTitle,
                                                          //          data.endorsements[lineCount].description,
                                                          //          data.endorsements[lineCount].remarks)
                                                          data.endorsements[lineCount]
                                                           );
                                                          this.saveEndt.quoteId = data.endorsements[lineCount].quoteId;
                                                          this.saveEndt.optionId = data.endorsements[lineCount].optionId;
                                                          // this.saveEndt.createDate = this.formatDate(data.endorsements[lineCount].createDate);
                                                          this.saveEndt.createUser = this.ns.getCurrentUser();
                                                          this.saveEndt.updateUser = this.ns.getCurrentUser();          
            }
            if(data.endorsements.length == 0){
                // console.log(data)
                // this.endorsementData.tableData = JSON.parse(JSON.stringify(this.defaultEndorsements));
                // this.table.markAsDirty();
            }
           /* this.table.refreshTable();*/
            this.table.refreshTable();
       });
      }
      else{
          this.deductibleTable.selected = []
          this.table.selected = []
          this.endorsementData.tableData = [];
          this.deductiblesData.tableData = [];
          this.endorsementData.disableAdd = true;
          this.deductiblesData.disableAdd = true;
          this.table.refreshTable();
          this.opId = null;
      }
    }

    save() {
        //do something
    }

    clickModal(event) {
        if(this.opId !== null)
        $('#idMdl > #modalBtn').trigger('click');
    }


    clickEndtLOV(data){
        this.hideEndt = this.endorsementData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.endtCd);
        $('#edntCodeLOV #modalBtn').trigger('click');
        data.tableData = this.endorsementData.tableData;
        this.endtCodeLOVRow = data.index;
    }

    selectedEndtLOV(data){
        this.endorsementData.tableData = this.endorsementData.tableData.filter(a=>a.showMG!=1);
        for(var i = 0; i<data.length;i++){
          this.endorsementData.tableData.push(JSON.parse(JSON.stringify(this.endorsementData.nData)));
          this.endorsementData.tableData[this.endorsementData.tableData.length-1].endtTitle = data[i].endtTitle; 
          this.endorsementData.tableData[this.endorsementData.tableData.length-1].endtDescription = data[i].description; 
          // this.endorsementData.tableData[this.endorsementData.tableData.length-1].endtWording  = data[i].remarks; 
          this.endorsementData.tableData[this.endorsementData.tableData.length-1].edited  = true; 
          this.endorsementData.tableData[this.endorsementData.tableData.length-1].endtCd = data[i].endtCd; 
          this.endorsementData.tableData[this.endorsementData.tableData.length-1].showMG = 0; 
        }

        this.table.refreshTable();
    }

    ngOnDestroy() {
        
        this.sub.unsubscribe();
    }

    plainQuotationNo(data: string){
        var arr = data.split('-');
        return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
    }

    // arn //
    endorsementReq:any;
    endorsementReqOc:any;

    saveEndorsementsOc: any[] = [];
    deleteEndorsementsOc: any[] =[];

    saveData(cancelFlag?){
        this.cancelFlag = cancelFlag !== undefined;
        let saveEndtReq = {
            optionId: this.opId,
            quoteId: this.quoteId,
            saveEndorsements: [],
            deleteEndorsements : [],
            saveDeductibleList: [],
            deleteDeductibleList: []
        };

        if(this.from === "quo-processing"){

            for (var i = 0 ; this.endorsementData.tableData.length > i; i++) {
              (this.saveEndt.createDate === null) ? this.ns.toDateTimeString(0) : this.saveEndt.createDate;
              (this.saveEndt.createUser == null) ? this.ns.getCurrentUser() : this.saveEndt.createUser;
              if(this.endorsementData.tableData[i].deleted){
                  saveEndtReq.deleteEndorsements.push({
                      "createDate": this.ns.toDateTimeString(0),
                      "createUser": this.ns.getCurrentUser(),
                      "endtCd": this.endorsementData.tableData[i].endtCd,
                      "remarks":  this.endorsementData.tableData[i].endtWording,
                      "updateDate": this.ns.toDateTimeString(0),
                      "updateUser": this.saveEndt.updateUser
                  })
                  // this.endorsementReq = {
                  //    "deleteEndorsements": [
                  //       {
                  //         "createDate": this.ns.toDateTimeString(0),
                  //         "createUser": this.ns.getCurrentUser(),
                  //         "endtCd": this.endorsementData.tableData[i].endtCode,
                  //         "remarks":  this.endorsementData.tableData[i].endtWording,
                  //         "updateDate": this.ns.toDateTimeString(0),
                  //         "updateUser": this.saveEndt.updateUser
                  //       }
                  //    ],
                  //     "optionId": this.opId,
                  //     "quoteId": this.saveEndt.quoteId,
                  //     "saveEndorsements": []
                  // }
                  // this.quotationService.saveQuoteEndorsements(JSON.stringify(saveEndtReq))
                  //     .subscribe(data => {
                  //       console.log(data);
                  //       $('#successMdl > #modalBtn').trigger('click');
                  //     });
              }
              else if(this.endorsementData.tableData[i].edited && !this.endorsementData.tableData[i].deleted){
                  saveEndtReq.saveEndorsements.push({
                      "createDate": (this.saveEndt.createDate === null || this.saveEndt.createDate === "") ? this.ns.toDateTimeString(0) : this.saveEndt.createDate,
                      "createUser": (this.saveEndt.createUser === null || this.saveEndt.createUser === "") ? this.ns.getCurrentUser() : this.saveEndt.createUser,
                      "endtCd": this.endorsementData.tableData[i].endtCd,
                      "remarks":  this.endorsementData.tableData[i].remarks,
                      "updateDate": this.ns.toDateTimeString(0),
                      "updateUser": this.ns.getCurrentUser()
                  })

                  
              }
              for(let ded of this.endorsementData.tableData[i].deductiblesList){
                  console.log(ded);
                  ded.createDate = null;
                  ded.updateDate = null;
                  ded.endtCd = this.endorsementData.tableData[i].endtCd;
                  ded.updateUser = this.ns.getCurrentUser();
                  if(ded.edited && !ded.deleted){
                    saveEndtReq.saveDeductibleList.push(ded);
                  }else if(ded.edited && ded.deleted){
                    saveEndtReq.deleteDeductibleList.push(ded);
                  }
                }


            }
            
              for(let ded of saveEndtReq.saveDeductibleList){
               if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
                 this.dialogIcon = "error";
                 setTimeout(a=>$('#quote-endorsment #successMdl > #modalBtn').trigger('click'),0);
                 return null;
               }
             }
            this.quotationService.saveQuoteEndorsements(JSON.stringify(saveEndtReq))
              .subscribe((data:any) => { 
                console.log(data);
                if(data.returnCode==-1){
                  this.dialogIcon = 'Success'
                  this.deductibleTable.markAsPristine();
                  this.table.markAsPristine();
                  console.log(this.table)
                  $('#quote-endorsment #successMdl > #modalBtn').trigger('click');
                }else{
                  this.dialogIcon = 'error';
                  $('#quote-endorsment #successMdl > #modalBtn').trigger('click');
                }  
              });
        }
    }
    formatDate(date){
        return new Date(date[0] + "/" + date[1] + "/" + date[2]).toISOString();
    }
    // end-arn //

    //Neco
    plainQuotationNoOc(data: string){
        var arr = data.split('-');
        return arr[0]+ '-' +arr[1] + '-' + arr[2] + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]) + '-' +this.checkIdFormat(arr[5]);
    }

    //temporary fix for leading zeroes
    checkIdFormat(id: any){
      if(parseInt(id) > 99){
        return id;
      }else{
        if(parseInt(id) > 9){
          return '0'+id;
        }
        else if(parseInt(id) < 10){
          return '00'+id;
        }
      }
    }
    //end neco

    onClickSave(){
      //console.log(this.table.selected);
      $('#endtSave #confirm-save #modalBtn2').trigger('click');
    }

    cancel(){

      this.cancelBtn.clickCancel();
    }

    showDeductiblesOptions(){
      if(this.table.indvSelect != null && this.optionTable.indvSelect){
          this.showModal = true;
          setTimeout(()=>{
                this.deductiblesModal.openNoClose();
          },0)
          let params:any ={
                quoteId:this.quoteId,
                optionId:this.optionTable.indvSelect.optionId,
                coverCd: '0',
                quotationNo: '',
                endtCd: this.table.indvSelect.endtCode    
          };
          this.quotationService.getDeductibles(params).subscribe((data)=>{
              if(data['quotation'].optionsList != null){
                this.deductiblesData.tableData = data['quotation'].optionsList[0].deductiblesList;
                this.deductibleTable.refreshTable();
              }
              else
                this.getDefaultDeductibles();
            });
      }
    }

  // onClickSaveDeductibles(){
  //   $('#deductibles #confirm-save #modalBtn2').trigger('click');
    
  // }


  // saveQuoteDeductibles(){
  //     let params: any = {
  //          quoteId:this.quoteId,
  //          optionId: this.optionTable.indvSelect.optionId,
  //          saveDeductibleList:[],
  //          deleteDeductibleList:[]
           
  //      }
  //       for (var i = 0 ; this.deductiblesData.tableData.length > i; i++) {
  //           if(this.deductiblesData.tableData[i].edited && !this.deductiblesData.tableData[i].deleted ) {
  //               params.saveDeductibleList.push(this.deductiblesData.tableData[i]);
  //               params.saveDeductibleList[params.saveDeductibleList.length-1].createDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[2]).toISOString();
  //               params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[2]).toISOString();
  //           } else if(this.deductiblesData.tableData[i].edited && this.deductiblesData.tableData[i].deleted){
  //             params.deleteDeductibleList.push(this.deductiblesData.tableData[i]);
  //             params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[2]).toISOString();
  //             params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[2]).toISOString();
  //           }
  //         }
  //        this.quotationService.saveQuoteDeductibles(JSON.stringify(params)).subscribe((data: any) => {
  //           if(data['returnCode'] == 0) {  
  //               // this.dialogMessage = data['errorList'][0].errorMessage;
  //               this.dialogIcon = "error";
  //               $('#quote-endorsment #successModalBtn').trigger('click');
  //           }else if(data['returnCode'] == -1){
  //               // this.dialogMessage="";
  //               this.dialogIcon = "";
  //               $('#quote-endorsment #successModalBtn').trigger('click');
  //               this.deductibleTable.markAsPristine();
  //               //this.showDeductiblesOptions();
  //          }
  //        });

  //  }

   passLOVData: any = {
      selector:'',
      data:{}
    }
    deductiblesLOVRow : number;

   clickDeductiblesLOV(data){
        this.passLOVData.selector = 'deductibles';
        this.passLOVData.lineCd = this.quotationInfo['lineCd'];
        this.passLOVData.hide = this.deductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
        this.passLOVData.endtCd = this.table.indvSelect.endtCd;
        this.passLOVData.params = {
          coverCd : '0',
          activeTag:'Y'
        }
        this.lov.openLOV();
        this.deductiblesLOVRow = data.index;
    }

   setSelected(data){
      this.deductibleTable.markAsDirty();
      if(data.selector == "deductibles"){
            this.deductiblesData.tableData = this.deductiblesData.tableData.filter(a=>a.showMG!=1);
            for(var i = 0; i<data.data.length;i++){
              this.deductiblesData.tableData.push(JSON.parse(JSON.stringify(this.deductiblesData.nData)));
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].edited = true;
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
              this.deductiblesData.tableData[this.deductiblesData.tableData.length -1].showMG = 0
            }
            this.selectedEndt.deductiblesList = this.deductiblesData.tableData;
      }

            this.deductibleTable.refreshTable();
    }
    defaultEndorsements: any[];
    // getDefaultEndorsements(){
    //     this.defaultEndorsements = [];
    //     this.mtnService.getEndtCode(this.line,'').subscribe((data: any) => {
    //       for(let d of data.endtCode.filter(a=>a.defaultTag=='Y')){
    //           this.defaultEndorsements.push(d);
    //           this.defaultEndorsements[this.defaultEndorsements.length-1].edited = true;
    //           this.defaultEndorsements[this.defaultEndorsements.length-1].deductiblesList = [];
    //       }
    //     });
    //}

    updateDed(data){
        this.deductibleTable.selected = [];
        this.deductiblesData.tableData.forEach(a=>a.checked = false);
        if(data==null || data.endtCd ==null){
            this.deductiblesData.disableAdd = true;
            this.deductiblesData.tableData = [];
        }
        else if(data.deductiblesList.length == 0 && data.add){
            this.getDefaultDeductibles();
            this.deductiblesData.disableAdd = false;
        }
        else{
            this.deductiblesData.tableData = data.deductiblesList;
            this.deductiblesData.disableAdd = false;
        }
        this.deductibleTable.refreshTable();
    }

    getDefaultDeductibles(){
    this.uwService.getMaintenanceDeductibles(this.quotationInfo['lineCd'],'',
        '0',this.table.indvSelect.endtCd,'Y','Y').subscribe((data)=>{
          this.table.indvSelect.deductiblesList = data['deductibles'].filter((a)=>{
            a.sumInsured = 0;
            a.coverCd = 0;
            a.deductibleTxt = a.deductibleText;
            a.deductibleRt = a.deductibleRate;
            a.endtCd = this.table.indvSelect.endtCode;
            a.edited = true;
            a.createDate = null;
            a.updateDate = null;
            return true;
          })
          this.deductiblesData.tableData = this.table.indvSelect.deductiblesList
          this.deductibleTable.refreshTable();
          this.deductibleTable.markAsDirty();
        })

  }
  

}