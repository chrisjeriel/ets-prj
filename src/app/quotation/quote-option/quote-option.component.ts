import { Component, OnInit } from '@angular/core';
import { QuotationInfo, QuotationOption, QuotationOtherRates, QuotationDeductibles } from '../../_models';
import { QuotationService } from '../../_services';
import { Title } from '@angular/platform-browser';



@Component({
    selector: 'app-quote-option',
    templateUrl: './quote-option.component.html',
    styleUrls: ['./quote-option.component.css']
})
export class QuoteOptionComponent implements OnInit {
    private quotationInfo: QuotationInfo;
    private quotationOption: QuotationOption;
    private quotationOtherRates: QuotationOtherRates;

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
    otherRatesNData: QuotationOtherRates = new QuotationOtherRates(null, null, null, null);
    
    optionsData: any = {
        tableData: this.quotationService.getQuoteOptions(),
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        dataTypes: ['text', 'percent', 'text', 'percent', 'percent', 'percent'],
        magnifyingGlass: ['conditions'],
        nData: new QuotationOption(null, null, null, null, null, null),
        pageLength: 3,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        pageID: 1,
    }
    deductiblesData: any = {
        tableData: this.quotationService.getDeductibles(),
        tHeader: ['Deductible Title', 'Rate', 'Amount', 'Deductible Text'],
        dataTypes: ['text', 'percent', 'currency', 'text'],
        nData: new QuotationDeductibles(null, null, null, null),
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        pageID: 2,
    }
    
    otherRatesData: any = {
        tableData: this.quotationService.getQuotataionOtherRates(1),
        tHeader: ['Others', 'Rate', 'Amount'],
        dataTypes: ['text', 'percent', 'currency'],
        nData: new QuotationOtherRates(null, null, null, null),
        magnifyingGlass: ['others'],
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        pageID: 3,
    }

    constructor(private quotationService: QuotationService, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | Quote Option");
        this.quotationInfo = new QuotationInfo();
        this.quotationInfo.quotationNo = "SMP-0000-0000-00";
        this.quotationInfo.insuredName = "Insured Name";
        this.quoteOptionTableData = this.quotationService.getQuoteOptions();
        this.otherRatesTableData = this.quotationService.getQuotataionOtherRates(1);
    }

    save() {
        console.log(this.quoteOptionEdited);
    }

    clickRow(event) {
        console.log(event);
        this.otherRatesTableData = this.quotationService.getQuotataionOtherRates(event.target.closest("tr").children[1].children[0].children[1].value);
    }


}
