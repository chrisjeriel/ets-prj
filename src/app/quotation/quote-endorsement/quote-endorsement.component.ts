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
              console.log("OPEN COVER !!!");
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
              console.log(">>>>>>>>>>>OC<<<<<<<<<<<<<")
          
              this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                this.quoteNoOc = params['ocQuoteNo'];
                this.quoteNoData =  this.quoteNoOc;
                   /* if (this.from == "oc-processing") {
                        this.quoteNoOc = params['ocQuoteNo'];
                    }*/
               });
           /*     var quoteId = '1';*/
                var quoteNumOc = this.plainQuotationNoOc(this.quoteNoOc)
                this.quotationService.getEndorsementsOc(null,quoteNumOc).subscribe((data: any) => {
                    console.log(data.endorsementsOc)
                   /* this.quoteNoData = data.endorsementsOc[0].quotationNo;*/
                        for(var lineCount = 0; lineCount < data.endorsementsOc.length; lineCount++){
                              this.endorsementOCData.tableData.push(new QuoteEndorsementOC(
                                                                           data.endorsementsOc[lineCount].endtCd, 
                                                                           data.endorsementsOc[lineCount].endtTitle,
                                                                           data.endorsementsOc[lineCount].projDesc,
                                                                           data.endorsementsOc[lineCount].remarks)
                                                                   );          
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
                    console.log("<<<<<<<<<<<<<<<<Edit- Quotation>>>>>>>>>>>>>>>>>");
                    this.quotationService.getQuoteGenInfo(null,this.plainQuotationNo(this.quotationNum)).subscribe((data: any) => {
                        this.insured = data.quotationGeneralInfo.insuredDesc; 
                        this.quoteNoData = data.quotationGeneralInfo.quotationNo;
                        if(data.project == null){
                             this.riskName = null;
                        } else {
                            this.riskName = data.project.riskName; 
                        }
                    });
                    this.quotationService.getQuoteOptions().subscribe((data: any) => {
                        // this.optionRecords = data.QuotationOption.optionsList;
                        for(var i = data.quotation.optionsList.length - 1; i >= 0; i--){
                           this.quoteOptionsData.tableData.push(new QuotationOption (
                                                        data.quotation.optionsList[i].optionId,
                                                        data.quotation.optionsList[i].optionRt,
                                                        data.quotation.optionsList[i].condition,
                                                        data.quotation.optionsList[i].commRtQuota,
                                                        data.quotation.optionsList[i].commRtSurplus,
                                                        data.quotation.optionsList[i].commRtFac));
                        }
                         this.tableNonEditable.refreshTable();
                    });
                  
                    
                    this.quotationService.getEndorsements(null,this.plainQuotationNo(this.quotationNum),'1').subscribe((data: any) => {
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
                        this.table.forEach(table => { table.refreshTable() });
                          
                    }); 
                }  

                

            }

    }

    clickRow(event) {
/*           this.quotationService.getEndorsements(null,this.quotationNum,event.optionNo).subscribe((data: any) => {*/
           this.quotationService.getEndorsements(null,this.plainQuotationNo(this.quotationNum),event.optionId).subscribe((data: any) => {
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
                }
               /* this.table.refreshTable();*/
                this.table.forEach(table => { table.refreshTable() });
           });

      /*  this.tableData = this.quotationService.getEndorsements(event.target.closest("tr").children[1].innerText);*/
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
        this.endorsementData.tableData[this.endtCodeLOVRow].endtCode = data.endtCd; 
        this.endorsementData.tableData[this.endtCodeLOVRow].endtTitle = data.endtTitle; 
        this.endorsementData.tableData[this.endtCodeLOVRow].endtDescription = data.description; 
        this.endorsementData.tableData[this.endtCodeLOVRow].endtWording  = data.remarks; 
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

    onClickSave(event){
         for(var i=0;i<this.endorsementData.tableData.length;i++){
            this.endorsementReq = {
                // "createDate": this.saveEndt.createDate,
                "createDate": new Date().toISOString(),
                // "createUser":  this.saveEndt.createUser,
                "createUser":  "user",
                "endtCd":       this.endorsementData.tableData[i].endtCode,
                // "optionId":    this.saveEndt.optionId,
                "optionId":    23,
                // "quoteId":      this.saveEndt.quoteId,
                "quoteId":      12,
                "remarks":    this.endorsementData.tableData[i].endtWording,
                "updateDate":  new Date().toISOString(),
                // "updateUser":  this.saveEndt.updateUser
                "updateUser":  "use"
            }
            console.log(this.endorsementReq);
        }

        this.quotationService.saveQuoteEndorsements(JSON.stringify(this.endorsementReq))
            .subscribe(data => console.log(data));
    }
    formatDate(date){
        return new Date(date[0] + "/" + date[1] + "/" + date[2]).toISOString();
    }
    // end-arn //

    plainQuotationNoOc(data: string){
        var arr = data.split('-');
        return arr[1] + '-' + arr[2] + '-' + arr[3] + '-' + arr[4] + '-' + arr[5] ;
    }

}
