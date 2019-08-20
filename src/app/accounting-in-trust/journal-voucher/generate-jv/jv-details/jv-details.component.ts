import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmountDetailsCV, AccountingEntriesCV, VATDetails, CreditableTax } from '@app/_models';
import { AccountingService, NotesService } from '../../../../_services';

@Component({
  selector: 'app-jv-details',
  templateUrl: './jv-details.component.html',
  styleUrls: ['./jv-details.component.css']
})
export class JvDetailsComponent implements OnInit {
  
  @Input() jvType: any;
  @Input() jvData:any;
  @Input() cedingInput:any;
  @Output() cedingData = new EventEmitter<any>();

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

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    if(this.jvType == null){
      this.jvType = "";
    }
    console.log(this.cedingInput)
    this.retrieveJVDetails();
  }

  retrieveJVDetails(){
    this.jvDetails = this.jvData;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.ns.toDateTimeString(this.jvDetails.refnoDate);
  }

  ceding(data){
    console.log('emit on jvDetails')
    this.cedingData.emit({ cedingId: data.cedingId,
                           cedingName: data.cedingName
                       });
  }

}
