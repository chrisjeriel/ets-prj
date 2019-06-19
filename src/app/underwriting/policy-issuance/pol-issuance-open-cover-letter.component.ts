import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pol-issuance-open-cover-letter',
  templateUrl: './pol-issuance-open-cover-letter.component.html',
  styleUrls: ['./pol-issuance-open-cover-letter.component.css']
})
export class PolIssuanceOpenCoverLetterComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router, private modalService: NgbModal) { }

  @ViewChild('tabset') tabset: any;
  policyInfo:any;
  inqFlag:any;
  title:string = "Policy / Issuance / Create Open Cover /";
  exitLink:string;

  ngOnInit() {
  	this.route.params.subscribe(a=>{
  		this.policyInfo = a;
      this.inqFlag = a['inqFlag'] == 'true';
      if(this.inqFlag){
        this.title = "Policy / Inquiry / Open Cover Inquiry /"
      }
      this.exitLink = a['exitLink']

  	})    
  }

  onTabChange($event: NgbTabChangeEvent) {
     // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
     //     $event.preventDefault();
   //   }                     
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl(this.exitLink);
      }
      else if ($event.nextId === 'print-tab') {
          $event.preventDefault();
      }
      else if($('.ng-dirty.ng-touched:not([type="search"])').length != 0 ){
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
             $('.ng-dirty').removeClass('ng-dirty');
             this.tabset.select($event.nextId)
           }
         })


       }
    }

    showApprovalModal(content) {
      this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    }

}
