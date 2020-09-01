import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '@app/_services';
import { ARTaxDetailsVAT, ARTaxDetailsWTAX, AccARInvestments} from '@app/_models';
import { ActivatedRoute} from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-ar-details',
  templateUrl: './ar-details.component.html',
  styleUrls: ['./ar-details.component.css']
})
export class ArDetailsComponent implements OnInit {

  passDataTaxDetailsVat: any = {
    tableData: this.accountingService.getARTaxDetailsVAT(),
    tHeader: ["VAT Type", "BIR RLF Purchase Type", "Payor", "Base Amount", "VAT Amount"],
    dataTypes: ["select", "text", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: new ARTaxDetailsVAT(null, null, null, null, null),
    total: [null, null, 'Total', null, 'vatAmount'],
    genericBtn: 'Save',
    opts: [{ selector: "vatType", vals: ["Input", "Output"] }],
    uneditable: [false, false, false, false, true],
    pageID: 4
  };

  passDataTaxDetailsCreditableWtax: any = {
    tableData: this.accountingService.getARTaxDetailsWTAX(),
    tHeader: ["BIR Tax Code", "Description", "WTax Rate", "Payor", "Base Amount", "WTax Amount"],
    dataTypes: ["select", "text", "percent", "text", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    pageLength: 5,
    widths: [],
    paginateFlag: true,
    nData: new ARTaxDetailsWTAX(null, null, null, null, null, null),
    total: [null, null, null, 'Total', null, 'wtaxAmount'],
    genericBtn: 'Save',
    opts: [{ selector: "birTaxCode", vals: ["WC020", "WC002", "WC010"] }],
    uneditable: [false, false, false, false, false, true],
    pageID: 3
  };

  @Input() paymentType: string = "";
  @Input() record: any = {};
    @ViewChild(NgbTabset) tabset: any;

  investmentData: any;
  createUpdate: any;
   
  constructor(private titleService: Title, private modalService: NgbModal, private accountingService: AccountingService, private route : ActivatedRoute) { }

  action:string;
  private sub: any;
  ngOnInit() {
    this.titleService.setTitle("Acct-IT | AR Details");
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];
    });

    if(this.paymentType == null){
      this.paymentType = "";
    }
    console.log(this.record);
  }


  creditableWTax(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].birTaxCode == "WC002") {
        data[i].wtaxRate = 2;
      } else if (data[i].birTaxCode == "WC010") {
        data[i].wtaxRate = 10;
      } else if (data[i].birTaxCode == "WC020") {
        data[i].wtaxRate = 20;
      }
      data[i].wtaxAmount = data[i].wtaxRate * data[i].baseAmount / 100;
    }
    this.passDataTaxDetailsCreditableWtax.tableData = data;
  }

  pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'arNo'){
        return String(str).padStart(6, '0');
      }else if(field === 'dcbSeqNo'){
        return String(str).padStart(3, '0');
      }
    }
  }

  onTabChange($event: NgbTabChangeEvent) {

    if($('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length != 0){
      console.log('here 3');
      $event.preventDefault();
      const subject = new Subject<boolean>();
      const modal = this.modalService.open(ConfirmLeaveComponent,{
          centered: true, 
          backdrop: 'static', 
          windowClass : 'modal-size'
      });
      modal.componentInstance.subject = subject;

      subject.subscribe(a=>{
        if(a){
          console.log('here 4');
          $('.ng-dirty').removeClass('ng-dirty');
          this.tabset.select($event.nextId);
        }
      })
    
    }
  }
}

