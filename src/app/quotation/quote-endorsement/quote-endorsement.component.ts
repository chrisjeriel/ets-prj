

import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { QuotationInfo, QuotationOption, QuoteEndorsement , QuoteEndorsementOC} from '../../_models';
import { QuotationService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'



@Component({
    selector: 'app-quote-endorsement',
    templateUrl: './quote-endorsement.component.html',
    styleUrls: ['./quote-endorsement.component.css']
})
export class QuoteEndorsementComponent implements OnInit {

    @Input() endorsementType: string = "";
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    OpenCover: boolean;
    private sub: any;
    from: string;
    quotationNum: string;
    quoteNoData: any;
    quoteIdOc: any;
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
    nData: QuoteEndorsement = new QuoteEndorsement(null, null, null, null, null);

    optionNos: number[] = [];

    optionsData: any = {
        tableData: this.quotationService.getQuoteOptions(),
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        dataTypes: ['text', 'percent', 'text', 'percent', 'percent', 'percent', 'percent'],
        resizable: [false, false, true, false, false, false],
        pagination: true,
        pageStatus: true,
        tableOnly: true,
        pageLength: 3,
    }

    endorsementData: any = {
        tableData: [],
        tHeader: ['Endt Code', 'Endt Title', 'Endt Description', 'Remarks'],
        magnifyingGlass: ['endtCode'],
        nData: new QuoteEndorsement(null, null, null, null, null),
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

        this.titleService.setTitle("Quo | Endorsement");
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
          
 /*             this.sub = this.route.params.subscribe(params => {.
                this.from = params['from'];
                    if (this.from == "open-cover-processing") {
                        this.quoteIdOc = params['quoteIdOc'];
                    }
               });
*/
/*                var quoteNum= this.quotationNum.split("-",5);
                this.quotationNum = quoteNum[0] + '-' + quoteNum[1] + '-' + Number(quoteNum[2]).toString() + '-' + Number(quoteNum[3]).toString() + '-' + Number(quoteNum[4]).toString()
*/

                this.quoteIdOc = 1;

                this.quotationService.getEndorsementsOc(this.quoteIdOc,null).subscribe((data: any) => {
                    console.log(data.endorsementsOc);
                    this.quoteNoData = data.endorsementsOc[0].quotationNo;
                    console.log(data.endorsementsOc[0].endtCd)
                        for(var lineCount = 0; lineCount < data.endorsementsOc.length; lineCount++){
                              this.endorsementOCData.tableData.push(new QuoteEndorsementOC(
                                                                           data.endorsementsOc[lineCount].endtCd, 
                                                                           data.endorsementsOc[lineCount].endtTitle,
                                                                           data.endorsementsOc[lineCount].projDesc,
                                                                           data.endorsementsOc[lineCount].remarks)
                                                                   );          
                          }
                        this.table.refreshTable();
                    });


            } else {
              this.OpenCover= false;

              this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                    if (this.from == "quo-processing") {
                        this.quotationNum = params['quotationNo'];
                    }
               });

                var quoteNum= this.quotationNum.split("-",5);
                this.quotationNum = quoteNum[0] + '-' + quoteNum[1] + '-' + Number(quoteNum[2]).toString() + '-' + Number(quoteNum[3]).toString() + '-' + Number(quoteNum[4]).toString()

                if (this.quotationService.toGenInfo[0] == "edit") {  
                    console.log("Edit- Quotation");

                    this.quotationService.getQuoteGenInfo(null,this.quotationNum).subscribe((data: any) => {
                        this.insured = data.quotationGeneralInfo.insuredDesc; 
                        this.quoteNoData = data.quotationGeneralInfo.quotationNo;
                        if(data.project == null){
                             this.riskName = null;
                        } else {
                            this.riskName = data.project.riskName; 
                        }
                    });
                    this.quotationService.getEndorsements(null,this.quotationNum,1).subscribe((data: any) => {
                        for(var lineCount = 0; lineCount < data.endorsements.length; lineCount++){
                              this.endorsementData.tableData.push(new QuoteEndorsement(
                                                                           data.endorsements[lineCount].endtCd, 
                                                                           data.endorsements[lineCount].endtTitle,
                                                                           data.endorsements[lineCount].description,
                                                                           data.endorsements[lineCount].remarks)
                                                                   );          
                          }
                        this.table.refreshTable();
                    });
                }  


            }


        

        
    }

    clickRow(event) {
/*           this.quotationService.getEndorsements(null,this.quotationNum,event.optionNo).subscribe((data: any) => {*/
           this.quotationService.getEndorsements('1','',event.optionNo).subscribe((data: any) => {
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
                this.table.refreshTable();
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

}
