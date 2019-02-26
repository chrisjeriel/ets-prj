import { Component, OnInit , ViewChild, Input, ViewChildren, QueryList} from '@angular/core';
import { QuotationInfo, QuotationOption, QuoteEndorsement , QuoteEndorsementOC} from '../../_models';
import { QuotationService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';



@Component({
    selector: 'app-quote-endorsement',
    templateUrl: './quote-endorsement.component.html',
    styleUrls: ['./quote-endorsement.component.css']
})
export class QuoteEndorsementComponent implements OnInit {

    @Input() endorsementType: string = "";
    @ViewChildren(CustEditableNonDatatableComponent) table: QueryList<CustEditableNonDatatableComponent>;
    @ViewChild(CustNonDatatableComponent) tableNonEditable: CustNonDatatableComponent;
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
    private quotationInfo: QuotationInfo;
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

    endtCodeLOVRow : number;

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title,  private route: ActivatedRoute) { }

    ngOnInit() {  
        this.titleService.setTitle("Quo | Endorsements");
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
        this.quotationInfo = new QuotationInfo();
        this.quotationInfo.quotationNo = "SMP-0000-0000-00";
        this.quotationInfo.insuredName = "Insured Name";
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
               this.quotationService.getOcGenInfoData('',this.quoteNoOc)
                    .subscribe(val => {
                     this.quoteIdOc = val['quotationOc'][0].quoteIdOc;
                     this.insured  = val['quotationOc'][0].insuredDesc;
                     //this.riskName  = val['quotationOc'][0].
                    });

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
                                                                  console.log(this.saveEndt.quoteId + " >>>>>> this.saveEndt.quoteId")
                                                                  this.saveEndt.createDate = this.formatDate(data.endorsementsOc[lineCount].createDate);
                                                                  console.log(this.saveEndt.createDate + " >>>>>> this.saveEndt.createDate")
                                                                  this.saveEndt.createUser = data.endorsementsOc[lineCount].createUser;
                                                                  console.log(this.saveEndt.createUser + " >>>>>> this.saveEndt.createUser")
                                                                  this.saveEndt.updateUser = data.endorsementsOc[lineCount].updateUser;          
                                                                  console.log(this.saveEndt.updateUser + " >>>>>> this.saveEndt.updateUser")
                          }
                        this.table.forEach(table => { table.refreshTable() });
      /*                    this.table.refreshTable();*/ 
                    });
                


            } else {
              this.OpenCover= false;

              this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                    if (this.from == "quo-processing") {
                        this.quotationNum = params['quotationNo'];
                    }
               });

                if (this.quotationService.toGenInfo[0] == "edit") {  
                    this.quotationService.getQuoteGenInfo(null,this.plainQuotationNo(this.quotationNum)).subscribe((data: any) => {
                        this.insured = data.quotationGeneralInfo.insuredDesc; 
                        this.quoteNoData = data.quotationGeneralInfo.quotationNo;
                        if(data.project == null){
                             this.riskName = null;
                        } else {
                            this.riskName = data.project.riskName; 
                        }
                        this.quoteId = data.quotationGeneralInfo.quoteId.toString();
                    });

                    this.quotationService.getQuoteOptions(this.quoteId,this.plainQuotationNo(this.quotationNum)).subscribe((data: any) => {
                        // this.optionRecords = data.QuotationOption.optionsList;
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
                            this.tableNonEditable.refreshTable();
                         }
                       
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

    clickRow(event) {
/*           this.quotationService.getEndorsements(null,this.quotationNum,event.optionNo).subscribe((data: any) => {*/
      this.opId = event.optionId;
           this.quotationService.getEndorsements(this.quoteId,this.plainQuotationNo(this.quotationNum),event.optionId).subscribe((data: any) => {
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
                                                                  console.log(this.saveEndt.createUser + "<<<<<<<<<< HETO HINAHANAP");
                                                                  this.saveEndt.updateUser = data.endorsements[lineCount].updateUser;          
                }
               /* this.table.refreshTable();*/
                this.table.forEach(table => { table.refreshTable() });
           });

      /*  this.tableData = this.quotationService.getEndorsements(event.target.closest("tr").children[1].innerText);*/

      
                    // this.saveEndt.optionId = event.optionId;
                    // this.quotationService.getEndorsements(this.quoteId,this.plainQuotationNo(this.quotationNum),this.saveEndt.optionId).subscribe((data: any) => {
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

    save() {
        //do something
    }

    clickModal(event) {
        $('#idMdl > #modalBtn').trigger('click');
    }


    clickEndtLOV(data){
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
        //keys: ['endtCode','endtTitle','description','remarks']
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

    onClickSave(event){
        if(this.from === "quo-processing"){
            for (var i = 0 ; this.endorsementData.tableData.length > i; i++) {
              if(this.endorsementData.tableData[i].edited && !this.endorsementData.tableData[i].deleted){
                  this.endorsementReq = {
                     "deleteEndorsements": [],
                      "optionId": this.opId,
                      "quoteId": this.quoteId,
                      "saveEndorsements": [
                        {
                          "createDate": this.saveEndt.createDate,
                          "createUser": this.saveEndt.createUser,
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
                        $('#successMdl > #modalBtn').trigger('click');
                      });
              }else if(this.endorsementData.tableData[i].edited && this.endorsementData.tableData[i].deleted){
                  this.endorsementReq = {
                     "deleteEndorsements": [
                        {
                          "createDate": this.saveEndt.createDate,
                          "createUser": this.saveEndt.createUser,
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
                      .subscribe(data => console.log(data));
              }
            }
        }else{
            for(var i = 0; i < this.endorsementOCData.tableData.length; i ++ ){
              if(this.endorsementOCData.tableData[i].edited && !this.endorsementOCData.tableData[i].deleted){
                this.endorsementReqOc = {
                  "deleteEndorsementsOc": [],
                    "quoteIdOc": this.quoteIdOc,
                    "saveEndorsementsOc": [
                      {
                        "createDate": this.saveEndt.createDate,
                        "createUser": this.saveEndt.createUser,
                        "endtCd": this.endorsementOCData.tableData[i].endtCode,
                        "remarks": this.endorsementOCData.tableData[i].remarks,
                        "updateDate": new Date().toISOString(),
                        "updateUser": "Login User"
                      }
                    ]
                }
                this.quotationService.saveQuoteEndorsementsOc(JSON.stringify(this.endorsementReqOc))
                  .subscribe(data => {
                    console.log(data) 
                    $('#successMdl > #modalBtn').trigger('click');
                  });
              }else if(this.endorsementOCData.tableData[i].edited && this.endorsementOCData.tableData[i].deleted){
                 this.endorsementReqOc = {
                   "deleteEndorsementsOc": [
                    {
                      "createDate": this.saveEndt.createDate,
                      "createUser": this.saveEndt.createUser,
                      "endtCd": this.endorsementOCData.tableData[i].endtCode,
                      "remarks": this.endorsementOCData.tableData[i].remarks,
                      "updateDate": new Date().toISOString(),
                      "updateUser": this.saveEndt.updateUser
                    }
                    ],
                    "quoteIdOc": this.quoteIdOc,
                    "saveEndorsementsOc": []
                 }
                 this.quotationService.saveQuoteEndorsementsOc(JSON.stringify(this.endorsementReqOc))
                  .subscribe(data => console.log(data));
              }
            }
        }
    }
    formatDate(date){
        return new Date(date[0] + "/" + date[1] + "/" + date[2]).toISOString();
    }
    // end-arn //
    plainQuotationNoOc(data: string){
        var arr = data.split('-');
        return arr[0]+ '-' +arr[1] + '-' + arr[2] + '-' + arr[3] + '-' + arr[4] + '-' + arr[5] ;
    }

}
