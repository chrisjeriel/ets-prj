import { Component, OnInit } from '@angular/core';
import { QuotationInfo,QuotationOption, QuoteEndorsement } from '../../_models';
import { QuotationService } from '../../_services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quote-endorsement',
  templateUrl: './quote-endorsement.component.html',
  styleUrls: ['./quote-endorsement.component.css']
})
export class QuoteEndorsementComponent implements OnInit {
  private quotationInfo: QuotationInfo;
  private quoteEndorsement: QuoteEndorsement;
  dtOptions:DataTables.Settings = {};

  quoteOptionTableData: any[] = [];
  quoteOptionTHeader : any[] = ['Option No','Rate(%)','Conditions','Comm Rate Quota(%)', 'Comm Rate Surplus(%)','Comm Rate Fac(%)'];
  quoteOptionDataType: any[] = ['text','percent','text','percent','percent','percent'];
  quoteOptionNData: QuotationOption = new QuotationOption(null,null,null,null,null,null);
  quoteOptionMagnifyingGlass:any[] = ['conditions'];
  quoteOptionEdited:QuotationOption[]=[];  

  tableData: any[] = [];
  tHeader: any[] = ['Endt Code','Endt Title', 'Endt Description', 'Wording'];
  magnifyingGlass: any[]=["endtTitle"]
  nData: QuoteEndorsement = new QuoteEndorsement(null,null, null, null, null);

  optionNos:number[] = [];
  constructor(private quotationService: QuotationService, private modalService: NgbModal) { }


  ngOnInit() {
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
  	this.quotationInfo.insuredName ="Insured Name";
    this.quoteOptionTableData = this.quotationService.getQuoteOptions();

    this.tableData = this.quotationService.getEndorsements(1);

  }

  clickRow(event){
    this.tableData = this.quotationService.getEndorsements(event.path[1].childNodes[3].childNodes[2].innerText);
  }
}
