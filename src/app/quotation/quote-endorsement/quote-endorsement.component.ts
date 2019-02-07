import { Component, OnInit , ViewChild} from '@angular/core';
import { QuotationInfo, QuotationOption, QuoteEndorsement } from '../../_models';
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
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    private sub: any;
    from: string;
    quotationNum: string;
    genInfoData: any;
    projectData: any;
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
        keys: ['endtCd','endtTitle','description','remarks']
    }

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title,  private route: ActivatedRoute) { }


    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.from = params['from'];
                if (this.from == "quo-processing") {
                    this.quotationNum = params['quotationNo'];
                }
        });

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
        this.quoteOptionTableData = this.quotationService.getQuoteOptions();

/*        this.tableData = this.quotationService.getEndorsements(1);*/
        if (this.quotationService.toGenInfo[0] == "edit") {
            console.log("Edit- Quotation");
            this.quotationService.getQuoteGenInfo(null,this.quotationNum).subscribe((data: any) => {
                this.genInfoData = data.quotationGeneralInfo; 
                this.projectData = data.project;                   
            });
            this.quotationService.getEndorsements(null,this.quotationNum,1).subscribe((data: any) => {
               /* while(this.endorsementsData.tableData.length > 0) {
                      this.endorsementsData.tableData.pop();
                }*/
                this.endorsementsData = data.endorsements;             
/*
                this.endorsementData.tableData.push();*/
                for (var i = this.endorsementsData.length - 1; i >= 0; i--) {
                   this.endorsementData.tableData.push(this.endorsementsData[i]);
                }
                this.table.refreshTable();
            });
        }
        

        
    }

    clickRow(event) {
           this.quotationService.getEndorsements(null,this.quotationNum,event.optionNo).subscribe((data: any) => {
                 while(this.endorsementData.tableData.length > 0) {
                  this.endorsementData.tableData.pop();
              }    

               this.endorsementsData = data.endorsements;  
                for (var i = this.endorsementsData.length - 1; i >= 0; i--) {
                   this.endorsementData.tableData.push(this.endorsementsData[i]);
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

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
