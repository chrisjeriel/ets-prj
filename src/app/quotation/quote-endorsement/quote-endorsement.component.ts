import { Component, OnInit , ViewChild, Input, ViewChildren, QueryList} from '@angular/core';
import { QuotationInfo, QuotationOption, QuoteEndorsement , QuoteEndorsementOC} from '../../_models';
import { QuotationService, UnderwritingService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';



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
        insuredDesc: ''
    }
    @Input() ocQuoteData: any = {};
    @ViewChild('endorsment') table: CustEditableNonDatatableComponent;
    @ViewChildren(CustNonDatatableComponent) tableNonEditable: QueryList<CustNonDatatableComponent>;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild("deductibleTable") deductibleTable: CustEditableNonDatatableComponent;
    @ViewChild(CustNonDatatableComponent) optionTable: CustNonDatatableComponent;
    @ViewChild('deductiblesModal') deductiblesModal : ModalComponent;

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
        tHeader: ['Endt Code', 'Endt Title', 'Endt Description', 'Remarks'],
        magnifyingGlass: ['endtCode'],
        nData: new QuoteEndorsement(null, null, null, null),
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        infoFlag: true,
        paginateFlag: true,
        searchFlag: true,
        keys: ['endtCode','endtTitle','endtDescription','endtWording']
    }

    endorsementOCData: any = {
        tableData: [],
        tHeader: ['Endt Code', 'Endt Title', 'Endt Description', 'Remarks'],
        magnifyingGlass: ['endtCode'],
        nData: new QuoteEndorsementOC(null, null, null, null),
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
        tHeader: ['Deductible Code','Deductible Title', 'Deductible Text', 'Deductible Rate(%)', 'Deductible Amount'],
        dataTypes: ['text','text', 'text', 'percent', 'currency','currency'],
        nData:{
            createDate: [2019, 2, 21, 0, 0, 0, 0],
            createUser: "ETC",
            deductibleAmt: null,
            deductibleCd: null,
            deductibleRt: null,
            deductibleTitle: null,
            deductibleTxt: null,
            optionId: null,
            updateDate: [2019, 2, 21, 0, 0, 0, 0],
            updateUser: "ETC",
            sumInsured: 0,
            endtCd: 0,
            coverCd: 0
        },
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 2,
        keys: ['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        widths: [60,'auto',100,120,'auto'],
        uneditable: [true,true],
        magnifyingGlass: ['deductibleCd']
    }
    showModal:boolean = false;
    dialogIcon: string;
    hideEndt: any[];

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, 
     private route: ActivatedRoute, private uwService: UnderwritingService) { }

    ngOnInit() {  
        if(this.OpenCover){
          this.cancelLink = '/open-cover-processing';
        }else{
          this.cancelLink = '/quotation-processing';
        }
        
        setTimeout(()=>{
            $('#endorsmentTable button').attr("disabled","disabled");
          },0)

        this.titleService.setTitle("Quo | Endorsements");
        //neco
        if(this.inquiryFlag && this.endorsementType !== 'OC'){
          this.endorsementData.opts = [];
          this.endorsementData.uneditable = [];
          this.endorsementData.magnifyingGlass = [];
          this.endorsementData.addFlag = false;
          this.endorsementData.deleteFlag = false;
          for(var count = 0; count < this.endorsementData.tHeader.length; count++){
            this.endorsementData.uneditable.push(true);
          }
        }else if(this.inquiryFlag && this.endorsementType === 'OC'){
          this.endorsementOCData.opts = [];
          this.endorsementOCData.uneditable = [];
          this.endorsementOCData.magnifyingGlass = [];
          this.endorsementOCData.addFlag = false;
          this.endorsementOCData.deleteFlag = false;
          for(var count = 0; count < this.endorsementOCData.tHeader.length; count++){
            this.endorsementOCData.uneditable.push(true);
          }
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
        // this.quotationInfo = new QuotationInfo();
        // this.quotationInfo.quotationNo = "SMP-0000-0000-00";
        // this.quotationInfo.insuredName = "Insured Name";
        //this.quoteOptionTableData = this.quotationService.getQuoteOptions();

/*        this.tableData = this.quotationService.getEndorsements(1);*/
          if (this.endorsementType == "OC") {
              this.OpenCover= true;
          
              this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                this.quoteNoOc = params['ocQuoteNo'];
                this.quoteNoData =  this.quoteNoOc;
                   /* if (this.from == "oc-processing") {
                        this.quoteNoOc = params['ocQuoteNo'];
                    }*/
               });
           /*     var quoteId = '1';*/

            //    arn
               this.line = (this.quoteNoOc.split("-")[1]).trim();
               /*this.quotationService.getOcGenInfoData(this.ocQuoteData.quoteIdOc,'')
                    .subscribe(val => {
                     this.quoteIdOc = val['quotationOc'][0].quoteIdOc;
                     this.insured  = val['quotationOc'][0].insuredDesc;
                     //this.riskName  = val['quotationOc'][0].
                    });*/

                     //var quoteNumOc = this.plainQuotationNoOc(this.quoteNoOc)
                        this.retrieveQuoteEndorsementOc();
                


            } else {
              this.OpenCover= false;

              this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                    if (this.from == "quo-processing") {
                        this.quotationNum = params['quotationNo'];
                    }


               });

                if (this.quotationService.toGenInfo[0] == "edit") {                  
                    this.quotationService.getQuoteGenInfo(null,this.plainQuotationNo(this.quotationInfo.quotationNo)).subscribe((data: any) => {
                        this.insured = data.quotationGeneralInfo.insuredDesc; 
                        this.quoteNoData = data.quotationGeneralInfo.quotationNo;
                        if(data.project == null){
                             this.riskName = null;
                        } else {
                            this.riskName = data.project.riskName; 
                        }
                        this.quoteId = data.quotationGeneralInfo.quoteId.toString();
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
                            this.optionTable.onRowClick(null,this.quoteOptionsData.tableData[0]);
                    });


                    // this.quotationService.getEndorsements(this.quoteId,this.plainQuotationNo(this.quotationNum),this.opId).subscribe((data: any) => {
                    //     for(var lineCount = 0; lineCount < data.endorsements.length; lineCount++){
                    //           this.endorsementData.tableData.push(new QuoteEndorsement(
                    //                                                        data.endorsements[lineCount].endtCd, 
                    //                                                        data.endorsements[lineCount].endtTitle,
                    //                                                        data.endorsements[lineCount].description,
                    //                                                        data.endorsements[lineCount].remarks)
                    //                                                );
                    //                                               this.saveEndt.quoteId = data.endorsements[lineCount].quoteId;
                    //                                               this.saveEndt.optionId = data.endorsements[lineCount].optionId;
                    //                                               this.saveEndt.createDate = this.formatDate(data.endorsements[lineCount].createDate);
                    //                                               this.saveEndt.createUser = data.endorsements[lineCount].createUser;
                    //                                               this.saveEndt.updateUser = data.endorsements[lineCount].updateUser;
                    //       }
                    //     this.table.forEach(table => { table.refreshTable() });
                    // }); 
                }  

                

            }

    }

    //neco
    retrieveQuoteEndorsementOc(){
       this.endorsementOCData.tableData = [];
       var quoteNumOc = this.plainQuotationNoOc(this.quoteNoOc)
       this.quotationService.getEndorsementsOc(this.quoteIdOc,quoteNumOc).subscribe((data: any) => {
     /* this.quoteNoData = data.endorsementsOc[0].quotationNo;*/
          for(var lineCount = 0; lineCount < data.endorsementsOc.length; lineCount++){
                this.endorsementOCData.tableData.push(new QuoteEndorsementOC(
                                                             data.endorsementsOc[lineCount].endtCd, 
                                                             data.endorsementsOc[lineCount].endtTitle,
                                                             data.endorsementsOc[lineCount].projDesc,
                                                             data.endorsementsOc[lineCount].remarks)
                                                     );
                                                    this.saveEndt.quoteId    = data.endorsementsOc[lineCount].quoteId;
                                                    this.saveEndt.createDate = this.formatDate(data.endorsementsOc[lineCount].createDate);
                                                    this.saveEndt.createUser = data.endorsementsOc[lineCount].createUser;
                                                    this.saveEndt.updateUser = data.endorsementsOc[lineCount].updateUser;          
            }
          this.table.refreshTable();
/*                    this.table.refreshTable();*/ 
      });
    }

    copyEndtRowClick(data){
      this.copyEndtOkBtn = data.checked;
    }

    copyEndtMethod(optionId: number){
      this.currentSelectedOption = optionId;
      this.copyEndtTable.tableData = [];
        for(var i of this.quoteOptionsData.tableData){
            if(optionId !== i.optionId){
              this.copyEndtTable.tableData.push({optionNo: i.optionId})
            }
        }
        this.tableNonEditable.forEach(table => {table.refreshTable()});
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
        createUser: (this.saveEndt.createUser === null || this.saveEndt.createUser === "") ? 'CPI' : this.saveEndt.createUser,
        createDate: (this.saveEndt.createDate === null || this.saveEndt.createDate === "") ? new Date().toISOString() : this.saveEndt.createDate,
        updateUser: 'CPI',
        updateDate: new Date().toISOString(),
      }

      this.quotationService.copyEndorsement(JSON.stringify(params)).subscribe((data: any) =>{
          console.log(data);
      });

    }
    //end neco


    clickRow(event) {
/*           this.quotationService.getEndorsements(null,this.quotationNum,event.optionNo).subscribe((data: any) => {*/
    if(event.optionId !== undefined){
     //neco
       this.copyEndtMethod(event.optionId);
     //end neco
      $('#endorsmentTable button').removeAttr("disabled");
      $('#endorsmentOCTable button').removeAttr("disabled");
      this.opId = event.optionId;
       this.quotationService.getEndorsements(this.quotationInfo.quoteId,this.plainQuotationNo(this.quotationInfo.quotationNo),event.optionId).subscribe((data: any) => {
             while(this.endorsementData.tableData.length > 0) {
              this.endorsementData.tableData.pop();
          }    
            for(var lineCount = 0; lineCount < data.endorsements.length; lineCount++){
                          this.endorsementData.tableData.push(new QuoteEndorsement(
                                                                       data.endorsements[lineCount].endtCd, 
                                                                       data.endorsements[lineCount].endtTitle,
                                                                       data.endorsements[lineCount].description,
                                                                       data.endorsements[lineCount].remarks)
                                                               );
                                                              this.saveEndt.quoteId = data.endorsements[lineCount].quoteId;
                                                              this.saveEndt.optionId = data.endorsements[lineCount].optionId;
                                                              this.saveEndt.createDate = this.formatDate(data.endorsements[lineCount].createDate);
                                                              this.saveEndt.createUser = data.endorsements[lineCount].createUser;
                                                              this.saveEndt.updateUser = data.endorsements[lineCount].updateUser;          
            }
           /* this.table.refreshTable();*/
            this.table.refreshTable();
       });
      }
      else{
          this.endorsementData.tableData = [];
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
        this.hideEndt = this.endorsementData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.endtCode);
        $('#edntCodeLOV #modalBtn').trigger('click');
        data.tableData = this.endorsementData.tableData;
        this.endtCodeLOVRow = data.index;
    }

    selectedEndtLOV(data){
      if(this.OpenCover === false){
        this.endorsementData.tableData[this.endtCodeLOVRow].endtCode = data.endtCd; 
        this.endorsementData.tableData[this.endtCodeLOVRow].endtTitle = data.endtTitle; 
        this.endorsementData.tableData[this.endtCodeLOVRow].endtDescription = data.description; 
        this.endorsementData.tableData[this.endtCodeLOVRow].endtWording  = data.remarks; 
      }else{ 
        this.endorsementOCData.tableData[this.endtCodeLOVRow].endtCode = data.endtCd; 
        this.endorsementOCData.tableData[this.endtCodeLOVRow].endtTitle = data.endtTitle; 
        this.endorsementOCData.tableData[this.endtCodeLOVRow].description = data.description; 
        this.endorsementOCData.tableData[this.endtCodeLOVRow].remarks  = data.remarks; 
      }
        
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
        if(this.from === "quo-processing"){
            for (var i = 0 ; this.endorsementData.tableData.length > i; i++) {
                (this.saveEndt.createDate === null) ? new Date().toISOString() : this.saveEndt.createDate;
              (this.saveEndt.createUser == null) ? "Login User" : this.saveEndt.createUser;
              if(this.endorsementData.tableData[i].edited && !this.endorsementData.tableData[i].deleted){
                  this.endorsementReq = {
                     "deleteEndorsements": [],
                      "optionId": this.opId,
                      "quoteId": this.quoteId,  
                      "saveEndorsements": [
                        {
                          "createDate": (this.saveEndt.createDate === null || this.saveEndt.createDate === "") ? new Date().toISOString() : this.saveEndt.createDate,
                          "createUser": (this.saveEndt.createUser === null || this.saveEndt.createUser === "") ? 'CPI' : this.saveEndt.createUser,
                          "endtCd": this.endorsementData.tableData[i].endtCode,
                          "remarks":  this.endorsementData.tableData[i].endtWording,
                          "updateDate": new Date().toISOString(),
                          "updateUser": "Login User"
                        }
                      ]
                  }
                  this.quotationService.saveQuoteEndorsements(JSON.stringify(this.endorsementReq))
                      .subscribe(data => { 
                        console.log(data);
                        this.table.markAsPristine();
                        $('#successMdl > #modalBtn').trigger('click');
                      });
              }else if(this.endorsementData.tableData[i].edited && this.endorsementData.tableData[i].deleted){
                  this.endorsementReq = {
                     "deleteEndorsements": [
                        {
                          "createDate": new Date().toISOString(),
                          "createUser": 'CPI',
                          "endtCd": this.endorsementData.tableData[i].endtCode,
                          "remarks":  this.endorsementData.tableData[i].endtWording,
                          "updateDate": new Date().toISOString(),
                          "updateUser": this.saveEndt.updateUser
                        }
                     ],
                      "optionId": this.opId,
                      "quoteId": this.saveEndt.quoteId,
                      "saveEndorsements": []
                  }
                  this.quotationService.saveQuoteEndorsements(JSON.stringify(this.endorsementReq))
                      .subscribe(data => {
                        console.log(data);
                        $('#successMdl > #modalBtn').trigger('click');
                      });
              }
            }
        }else{
            this.saveEndorsementsOc = [];
            this.deleteEndorsementsOc = [];
            for(var i = 0; i < this.endorsementOCData.tableData.length; i ++ ){
              if(this.endorsementOCData.tableData[i].edited && !this.endorsementOCData.tableData[i].deleted){
                  this.saveEndorsementsOc.push(
                    {
                      endtCd: this.endorsementOCData.tableData[i].endtCode,
                      remarks: this.endorsementOCData.tableData[i].remarks,
                      createDate: (this.saveEndt.createDate === null || this.saveEndt.createDate === "") ? new Date().toISOString() : this.saveEndt.createDate,
                      createUser: (this.saveEndt.createUser === null || this.saveEndt.createUser === "") ? 'CPI' : this.saveEndt.createUser,
                      updateUser: 'CPI',
                      updateDate: new Date().toISOString(),
                    }
                   );
               }else if(this.endorsementOCData.tableData[i].edited && this.endorsementOCData.tableData[i].deleted){

                 this.deleteEndorsementsOc.push(
                    {
                      endtCd: this.endorsementOCData.tableData[i].endtCode,
                      remarks: this.endorsementOCData.tableData[i].remarks,
                      createDate: (this.saveEndt.createDate === null || this.saveEndt.createDate === "") ? new Date().toISOString() : this.saveEndt.createDate,
                      createUser: (this.saveEndt.createUser === null || this.saveEndt.createUser === "") ? 'CPI' : this.saveEndt.createUser,
                      updateUser: 'CPI',
                      updateDate: new Date().toISOString(),
                    }
                 );
              }
            }

            this.endorsementReqOc = {
              quoteIdOc: this.ocQuoteData.quoteIdOc,
              saveEndorsementsOc: this.saveEndorsementsOc,
              deleteEndorsementsOc: this.deleteEndorsementsOc,
            }

            this.quotationService.saveQuoteEndorsementsOc(JSON.stringify(this.endorsementReqOc))
                  .subscribe(data => {
                    console.log(data);
                    $('#successMdl > #modalBtn').trigger('click');
                    this.retrieveQuoteEndorsementOc();
            });
        }
    }
    formatDate(date){
        return new Date(date[0] + "/" + date[1] + "/" + date[2]).toISOString();
    }
    // end-arn //
    plainQuotationNoOc(data: string){
        var arr = data.split('-');
        return arr[0]+ '-' +arr[1] + '-' + arr[2] + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]) + '-' + parseInt(arr[5]) ;
    }

    onClickSave(){
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


  getDefaultDeductibles(){
    this.uwService.getMaintenanceDeductibles(this.quotationNum.substring(0,3),'',
        '0',this.table.indvSelect.endtCode,'Y','Y').subscribe((data)=>{
          this.deductiblesData.tableData = data['deductibles'].filter((a)=>{
            a.sumInsured = 0;
            a.coverCd = 0;
            a.deductibleTxt = a.deductibleText;
            a.deductibleRt = a.deductibleRate;
            a.endtCd = this.table.indvSelect.endtCode;
            a.edited = true;
            return true;
          })
          this.deductibleTable.refreshTable();
          this.deductibleTable.markAsDirty();
        })
  }

  onClickSaveDeductibles(){
    $('#deductibles #confirm-save #modalBtn2').trigger('click');
    
  }


  saveQuoteDeductibles(){
      let params: any = {
           quoteId:this.quoteId,
           optionId: this.optionTable.indvSelect.optionId,
           saveDeductibleList:[],
           deleteDeductibleList:[]
           
       }
        for (var i = 0 ; this.deductiblesData.tableData.length > i; i++) {
            if(this.deductiblesData.tableData[i].edited && !this.deductiblesData.tableData[i].deleted ) {
                params.saveDeductibleList.push(this.deductiblesData.tableData[i]);
                params.saveDeductibleList[params.saveDeductibleList.length-1].createDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[2]).toISOString();
                params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[2]).toISOString();
            } else if(this.deductiblesData.tableData[i].edited && this.deductiblesData.tableData[i].deleted){
              params.deleteDeductibleList.push(this.deductiblesData.tableData[i]);
              params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[2]).toISOString();
              params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[2]).toISOString();
            }
          }
         this.quotationService.saveQuoteDeductibles(JSON.stringify(params)).subscribe((data: any) => {
            if(data['returnCode'] == 0) {  
                // this.dialogMessage = data['errorList'][0].errorMessage;
                this.dialogIcon = "error";
                $('#quote-endorsment #successModalBtn').trigger('click');
            }else if(data['returnCode'] == -1){
                // this.dialogMessage="";
                this.dialogIcon = "";
                $('#quote-endorsment #successModalBtn').trigger('click');
                this.deductibleTable.markAsPristine();
                //this.showDeductiblesOptions();
           }
         });
   }

   passLOVData: any = {
      selector:'',
      data:{}
    }
    deductiblesLOVRow : number;

   clickDeductiblesLOV(data){
        this.passLOVData.selector = 'deductibles';
        this.passLOVData.lineCd = this.quotationNum.substring(0,3);
        this.passLOVData.hide = this.deductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
        this.passLOVData.params = {
          coverCd : '0',
          endtCd: this.table.indvSelect.endtCode,
          activeTag:'Y'
        }
        $('#lov #modalBtn2').trigger('click');
        this.deductiblesLOVRow = data.index;
    }

   setSelected(data){
      this.deductibleTable.markAsDirty();
      if(data.selector == "deductibles"){
            this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleTitle = data.data.deductibleTitle;
            this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleRt = data.data.deductibleRate;
            this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleAmt = data.data.deductibleAmt;
            this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleTxt = data.data.deductibleText;
            this.deductiblesData.tableData[this.deductiblesLOVRow].edited = true;
            this.deductiblesData.tableData.push(JSON.parse(JSON.stringify(this.deductiblesData.tableData[this.deductiblesLOVRow])));
            this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleCd = data.data.deductibleCd;
            this.deductiblesData.tableData[this.deductiblesLOVRow].deleted = true;
            this.deductibleTable.refreshTable();
      }
    }



}