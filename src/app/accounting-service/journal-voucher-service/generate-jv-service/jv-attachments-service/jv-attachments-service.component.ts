import { Component, OnInit, Input } from '@angular/core';
import { AttachmentInfo} from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-jv-attachments-service',
  templateUrl: './jv-attachments-service.component.html',
  styleUrls: ['./jv-attachments-service.component.css']
})
export class JvAttachmentsServiceComponent implements OnInit {
  
  @Input() jvType: string = "";
  @Input() jvData: any;

  passData: any = {
      tableData: [],
      tHeader: ['File Name', 'Description', 'Actions'],
      dataTypes: ['string', 'string'],
      nData: {tranId: '', fileNo: '', fileName: '', description: ''},
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 10,
      uneditable: [true, false],
      keys: ['fileName', 'description'],
      widths: [463, 606, 1]
  };

  jvDetails : any = {
     jvNo: '', 
     jvYear: '', 
     jvDate: '', 
     jvType: '',
     jvStatus: '',
     refnoDate: '',
     refnoTranId: '',
     currCd: '',
     currRate: '',
     jvAmt: '',
     localAmt: ''
  };

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
    this.jvDetails = this.jvData;
  }
}
