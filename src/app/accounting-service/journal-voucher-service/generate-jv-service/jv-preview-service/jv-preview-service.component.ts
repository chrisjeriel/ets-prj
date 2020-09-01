import { Component, OnInit, Input } from '@angular/core';
import { AmountDetailsCV, AccountingEntriesCV, VATDetails, CreditableTax, ORPrevAmountDetails, ORPreVATDetails, ORPreCreditableWTaxDetails } from '@app/_models';
import { AccountingService } from '../../../../_services/accounting.service';

@Component({
  selector: 'app-jv-preview-service',
  templateUrl: './jv-preview-service.component.html',
  styleUrls: ['./jv-preview-service.component.css']
})
export class JvPreviewServiceComponent implements OnInit {
  @Input() jvType: string = "";
  @Input() jvData: any;
 

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
