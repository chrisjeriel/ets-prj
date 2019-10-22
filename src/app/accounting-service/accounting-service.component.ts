import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-accounting-service',
  templateUrl: './accounting-service.component.html',
  styleUrls: ['./accounting-service.component.css']
})
export class AccountingServiceComponent implements OnInit, OnDestroy {

  @ViewChild(NgbTabset) tabset: any;
  
  paymentType: string = "";
  private sub: any;
  action: string;
  record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };

  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private modalService: NgbModal) { }
  exitLink: string;
  exitTab: string;

  disableTab: boolean = true;
  orDetailsParam: any;

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] : 'acct-or-listings';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
  		this.action = params['action'];

  		if(this.action == 'edit'){
  			this.record = JSON.parse(params['slctd']);
  		}
    });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  checkTabs(event) {
  	var type = event.type;
  	this.paymentType = type; 	
  }

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
