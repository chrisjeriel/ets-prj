import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-internal-competition',
  templateUrl: './internal-competition.component.html',
  styleUrls: ['./internal-competition.component.css']
})
export class InternalCompetitionComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = ["Advice No.","Company","Attention","Position","Advice Option","Advice Wordings","Created By","Date Created", "Last Update By", "Last Update"];
  dataTypes: any[] = ["text","text","text","text","select","text","text","date", "text", "date"];
  magnifyingGlass: any[]=["attention","advWord"];
  nData: IntCompAdvInfo = new IntCompAdvInfo( null,null, null, null, null, null, null, new Date(), null, new Date());
  opts: any[] = [];

  constructor(private quotationService: QuotationService, private modalService: NgbModal) { }

  ngOnInit() {

  	this.tableData = this.quotationService.getIntCompAdvInfo();

    this.opts.push({selector: "advOpt", vals:["Pending", "On Going", "Done"]});

  }

  onClickPrint() {
   
  }

  onClickCancel() {
    
  }

  onClickSave() {
   
  }

  clickRow(event) {
       // var result = event.target.closest('tr').children[1].innerText;
       //  console.log(result);
       // for(var i = 0; i < event.target.closest("tr").children.length; i++) {
       //   console.log(event.target.closest("tr").children[i].ng-reflect-model.text);
      }
  }

