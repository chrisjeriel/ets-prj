import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
@Component({
  selector: 'app-accounting-in-trust',
  templateUrl: './accounting-in-trust.component.html',
  styleUrls: ['./accounting-in-trust.component.css']
})
export class AccountingInTrustComponent implements OnInit {

  @ViewChild(NgbTabset) tabset: any;

  disableTab: boolean = true;
  
  ipbTab: boolean = true;
  crTab: boolean = true;
  qsoaTab: boolean = true;

  private sub: any;
  record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };
  action: string;

  exitLink: string;
  exitTab: string;
  paymentType: string = "";

  arDetailsParam: any;

  constructor(private route: ActivatedRoute, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      console.log(params);
      this.exitLink = params['link'] !== undefined ? params['link'] : 'acct-ar-listings';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';

      this.action = params['action'];

      if(this.action == 'edit') {
        this.record = JSON.parse(params['slctd']);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTabs(event) {
  	var type = event.type;

  	this.paymentType = type;  	
  }

  /*tabController(type) {
  	if(type == 'INWARD POLICY BALANCES') {
  		this.ipbTab = false;
  		this.crTab = true;
  		this.qsoaTab = true;
  	} else if (type == 'CLAIM RECOVERY') {
  		this.crTab = false;
  		this.ipbTab = true;
  		this.qsoaTab = true;
  	} else if (type == 'QSOA') {
  		this.qsoaTab = false;
  		this.ipbTab = true;
  		this.crTab = true;
  	} else {
  		this.ipbTab = true;
  		this.crTab = true;
  		this.qsoaTab = true;
  	}
  }*/

  /* onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        // this.router.navigateByUrl('');
        this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
      } 
  
  }*/

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit' && $('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length == 0) {
     this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
    }

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
