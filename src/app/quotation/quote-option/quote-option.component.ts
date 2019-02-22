import { Component, OnInit, ViewChildren, QueryList, Input} from '@angular/core';
import { QuotationInfo, QuotationOption, QuotationOtherRates, QuotationDeductibles } from '../../_models';
import { QuotationService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-quote-option',
    templateUrl: './quote-option.component.html',
    styleUrls: ['./quote-option.component.css']
})
export class QuoteOptionComponent implements OnInit {
    @ViewChildren(CustEditableNonDatatableComponent) table: QueryList<CustEditableNonDatatableComponent>;
/*    private quotationInfo: QuotationInfo;*/
    private quotationOption: QuotationOption;
    private quotationOtherRates: QuotationOtherRates;
    private sub: any;
   @Input() quotationInfo: any = {};

    editedOtherRatesData: any[] = [];
    deletedOtherRatesData: any[] = [];

    quoteOptionTableData: any[] = [];
    quoteOptionTHeader: any[] = ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'];
    quoteOptionDataType: any[] = ['text', 'percent', 'text', 'percent', 'percent', 'percent'];
    quoteOptionNData: QuotationOption = new QuotationOption(null, null, null, null, null, null);
    magnifyingGlass: any[] = ['conditions'];
    quoteOptionEdited: QuotationOption[] = [];


    otherRatesTableData: any[] = [];
    otherRatesTHeader: any[] = ['Others', 'Amounts', 'Deductible'];
    otherRatesDataType: any[] = ['text', 'currency', 'text'];
    otherRatesMagnify: any[] = ['others', 'deductible'];
    otherRatesNData: QuotationOtherRates = new QuotationOtherRates(null, null, null, null, null,null,null,null,null,null);
    
    quoteNoData: string;
    quotationNum: string;
    insured: any;
    riskName: any;
    quoteId: any;
    from: string;

    optionsData: any = {
        tableData: [],
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        dataTypes: ['number', 'percent', 'text', 'percent', 'percent', 'percent'],
        magnifyingGlass: ['conditions'],
        nData: new QuotationOption(null, null, null, null, null, null),
        pageLength: 3,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 1,
        keys: ['optionId','optionRt','condition','commRtQuota','commRtSurplus','commRtFac'],
        uneditable: [true,false,false,false,false,false]
    }

    deductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code','Deductible Title', 'Rate(%)', 'Amount', 'Deductible Text'],
        dataTypes: ['text','text', 'percent', 'currency', 'text'],
        nData: new QuotationDeductibles(null,null, null, null, null),
        magnifyingGlass: ['deductibleCd'],
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 2,
        keys: ['deductibleCd','deductibleTitle','deductibleRt','deductibleAmt','deductibleTxt'],
        widths: [60,'auto',100,120,'auto'],
        uneditable: [true,true,false,false]
    }

    otherRatesData: any = {
        tableData: [],
        tHeader: ['Cover Code','', 'Rate(%)', 'Amount'],
        dataTypes: ['number', 'text', 'percent', 'currency'],
        nData: {
          amount: null,
          amountI: null,
          coverCd: null,
          coverCdDesc: null,
          createDate: [0,0,0],
          createUser: "ETC",
          rate: null,
          rateI: null,
          updateDate: [0,0,0],
          updateUser: "ETC"
        },
/*        magnifyingGlass: ['coverCd'],*/
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 3,
        keys: ['coverCd','coverCdDesc','rate','amount'],
        widths: [40,'auto',120,120],
        uneditable: [false,true,false,false]
    }

    otherRatesDataArray: any = {
        coverCd: null,
        rate: null,
        amount: null,
    }

    record: any[];
    constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute) { }

    ngOnInit() {

        this.titleService.setTitle("Quo | Quote Option");
     /*   this.quotationInfo = new QuotationInfo();
        this.quotationInfo.quotationNo = "SMP-0000-0000-00";
        this.quotationInfo.insuredName = "Insured Name";*/

        if (this.quotationService.toGenInfo[0] == "edit") {

            this.sub = this.route.params.subscribe(params => {
                this.from = params['from'];
                    if (this.from == "quo-processing") {
                        this.quotationNum = params['quotationNo'];
                    }
            });

             this.quotationService.getQuoteGenInfo(null,this.plainQuotationNo(this.quotationNum)).subscribe((data: any) => {
                        this.insured = data.quotationGeneralInfo.insuredDesc; 
                        this.quoteNoData = data.quotationGeneralInfo.quotationNo;
                        if(data.project == null){
                             this.riskName = null;
                        } else {
                            this.riskName = data.project.riskName; 
                        }
                        this.quoteId = data.quotationGeneralInfo.quoteId.toString();
                        this.getQuoteOptions();
            });

/*          this.quotationService.getQuoteOptions(this.quoteId,this.plainQuotationNo(this.quotationNum)).subscribe(data => {  
            var optionRecords = data['quotation'].optionsList;

                    for(let rec of optionRecords){
                        this.optionsData.tableData.push(new QuotationOption(
                            rec.optionId, 
                            rec.optionRt, 
                            rec.condition, 
                            rec.commRtQuota, 
                            rec.commRtSurplus, 
                            rec.commRtFac
                        ));                
                    }

                    for(let rec of optionRecords){
                       if (rec.optionId == 1 ) {
                          for(let r of rec.deductiblesList){                  
                            this.deductiblesData.tableData.push(new QuotationDeductibles(
                                r.deductibleCd,
                                r.deductibleTitle,
                                r.deductibleRt,
                                r.deductibleAmt,
                                r.deductibleTxt
                            ));
                        }     
                       }           
                    }
*/
  
    } else {
         this.quotationNum = this.quotationInfo.quotationNo.split(/[-]/g)[0];
         console.log(this.quotationNum);


    }
        

    }
    getQuoteOptions(){
        this.quotationService.getQuoteOptions(this.quoteId,this.plainQuotationNo(this.quotationNum)).subscribe(data => {  
           if (data['quotation'] == null || data['quotation'] == undefined ){ 
           } else {
               var optionRecords = data['quotation'].optionsList;

                for(let rec of optionRecords){
                    this.optionsData.tableData.push(new QuotationOption(
                        rec.optionId, 
                        rec.optionRt, 
                        rec.condition, 
                        rec.commRtQuota, 
                        rec.commRtSurplus, 
                        rec.commRtFac,
                        rec.deductiblesList
                    ));                
                }

/*              for(let rec of optionRecords){
                        if (rec.optionId == 1 ) {
                            for(let r of rec.deductiblesList){                  
                                    this.deductiblesData.tableData.push(new QuotationDeductibles(
                                        r.deductibleCd,
                                        r.deductibleTitle,
                                        r.deductibleRt,
                                        r.deductibleAmt,
                                        r.deductibleTxt
                                ));
                            }     
                        }           
                }*/

                var otherRatesRecords = data['quotation'].otherRatesList;

                for(let rec of otherRatesRecords){
                  this.otherRatesData.tableData.push(rec);                
              
                }
                
                this.table.forEach(table => { table.refreshTable() });
           }
        });

    } 

    getOtherRates(){
         this.quotationService.getQuoteOptions(this.quoteId,this.plainQuotationNo(this.quotationNum)).subscribe(data => {  
              if (data['quotation'] == null || data['quotation'] == undefined ){
                var otherRatesRecords = data['quotation'].otherRatesList;

                while(this.otherRatesData.tableData.length > 0) {
                  this.otherRatesData.tableData.pop();
                }    
                for(let rec of otherRatesRecords){
                  this.otherRatesData.tableData.push(rec);                
                }
                
                this.table.forEach(table => { table.refreshTable() });
              }
         });
    }



    save() {
        console.log(this.quoteOptionEdited);
    }

/*    clickRow(event) {
        console.log(event);
        //this.otherRatesTableData = this.quotationService.getQuotataionOtherRates(event.target.closest("tr").children[1].children[0].children[1].value);
    }
*/
    plainQuotationNo(data: string) {
        var arr = data.split('-');
        return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
    }

    updateDeductibles(data) {
        if (data.deductiblesList != null || data.deductiblesList != undefined ){
          this.deductiblesData.tableData = data.deductiblesList;
          this.table.forEach(table => { table.refreshTable() });
        } 

    }

   saveData(){

   for (var i = 0 ; this.otherRatesData.tableData.length > i; i++) {

      if(this.otherRatesData.tableData[i].edited && !this.otherRatesData.tableData[i].deleted ) {
          this.editedOtherRatesData.push(this.otherRatesData.tableData[i]);
          this.editedOtherRatesData[this.editedOtherRatesData.length-1].createDate = new Date(this.editedOtherRatesData[this.editedOtherRatesData.length-1].createDate[0],this.editedOtherRatesData[this.editedOtherRatesData.length-1].createDate[1]-1,this.editedOtherRatesData[this.editedOtherRatesData.length-1].createDate[2]).toISOString();
          this.editedOtherRatesData[this.editedOtherRatesData.length-1].updateDate = new Date(this.editedOtherRatesData[this.editedOtherRatesData.length-1].updateDate[0],this.editedOtherRatesData[this.editedOtherRatesData.length-1].updateDate[1]-1,this.editedOtherRatesData[this.editedOtherRatesData.length-1].updateDate[2]).toISOString();
      } else if(this.otherRatesData.tableData[i].edited && this.otherRatesData.tableData[i].deleted){
          this.deletedOtherRatesData.push(this.otherRatesData.tableData[i]);
          this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].createDate = new Date(this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].createDate[0],this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].createDate[1]-1,this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].createDate[2]).toISOString();
          this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].updateDate = new Date(this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].updateDate[0],this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].updateDate[1]-1,this.deletedOtherRatesData[this.deletedOtherRatesData.length-1].updateDate[2]).toISOString();
      }

    console.log(this.editedOtherRatesData);
    console.log(this.quoteId);

    this.quotationService.saveQuoteOtherRates(this.quoteId,this.editedOtherRatesData).subscribe((data: any) => {});
    $('#successModalBtn').trigger('click');
    this.getOtherRates();
  }

 }

}
