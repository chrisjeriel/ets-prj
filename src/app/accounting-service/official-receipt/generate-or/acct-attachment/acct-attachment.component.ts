import { Component, OnInit, Input } from '@angular/core';
import { AccServiceAttachment } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';
@Component({
  selector: 'app-acct-attachment',
  templateUrl: './acct-attachment.component.html',
  styleUrls: ['./acct-attachment.component.css']
})
export class AcctAttachmentComponent implements OnInit {
  
  AttachmentData: any = {
    tableData: this.accountingService.getAccServiceAttachment(),
    tHeader: ['File Path', 'Description', 'Action'],
    dataTypes: ['text', 'text'],
    nData: new AccServiceAttachment(null,null),
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    widths:['auto','auto',80]
  }

  @Input() paymentType: string = "type";

  constructor( private accountingService: AccountingService) { }

  ngOnInit() {
      if(this.paymentType == null){
        this.paymentType = "";
      }
  }

}
