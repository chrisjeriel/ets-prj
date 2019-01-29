import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AttachmentInfo } from '@app/_models';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-acc-attachments',
  templateUrl: './acc-attachments.component.html',
  styleUrls: ['./acc-attachments.component.css']
})
export class AccAttachmentsComponent implements OnInit {
  
  passData:any = {
  	tableData:[],
  	tHeader: ['File Path','Description', 'Actions'],
  	checkFlag: true,
  	addFlag:true,
  	deleteFlag:true,
  	infoFlag:true,
  	paginateFlag: true,
  	widths:['auto','auto',71],
  	nData: new AttachmentInfo(null,null),

  };
  sub: any;
  action:any;
  paymentType: string;

  constructor(private accountingService: AccountingService, private route : ActivatedRoute) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getAttachmentInfo();
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];
       this.paymentType = JSON.parse(params['slctd']).paymentType;
    });

    if(this.paymentType == null){
      this.paymentType = "";
    }
  }

}
