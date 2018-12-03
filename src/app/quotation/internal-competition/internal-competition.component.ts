import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';

@Component({
  selector: 'app-internal-competition',
  templateUrl: './internal-competition.component.html',
  styles: ['./internal-competition.component.css' ]
})
export class InternalCompetitionComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = ["Advice No.","Company","Attention","Position","Advice Option","Advice Wordings","Updated By","Last Update"];
  dataTypes: any[] = ["text","text","text","text","select","select","text","date"];
  magnifyingGlass: any[]=["attention","position","createdBy"];
  nData: IntCompAdvInfo = new IntCompAdvInfo( null,null, null, null, null, null, null, new Date());
  opts: any[] = [];

  constructor(private quotationService: QuotationService) { }

  ngOnInit() {

  	this.tableData = this.quotationService.getIntCompAdvInfo();

    this.opts.push({selector: "advOpt", vals:["Reminder", "Note"]},
                   {selector: "advWord", vals:["Pending", "On Going", "Done"]});

  }

  onClickPrint() {
   
  }

  onClickCancel() {
    
  }

  onClickSave() {
   
  }



}
