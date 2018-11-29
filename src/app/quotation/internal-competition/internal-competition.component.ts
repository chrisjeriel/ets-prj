import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';

@Component({
  selector: 'app-internal-competition',
  templateUrl: './internal-competition.component.html',
  styleUrls: ['./internal-competition.component.css']
})
export class InternalCompetitionComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = ["Advice No.","Company","Attention","Position","Advice Option","Advice Wordings","Created By","Date Created","Last Updated By","Last Update"];
  dataTypes: any[] = ["text","text","text","text","select","select","text","date","text","date"];
  magnifyingGlass: any[]=["attention","position","createdBy"];
  nData: IntCompAdvInfo = new IntCompAdvInfo(null, null, null, null, null, null, null, null, null, null);
  
  constructor(private quotationService: QuotationService) { }

  ngOnInit() {

  	this.tableData = this.quotationService.getIntCompAdvInfo();

  }

  onClickPrint() {
   
  }

  onClickCancel() {
    
  }

  onClickSave() {
   
  }



}
