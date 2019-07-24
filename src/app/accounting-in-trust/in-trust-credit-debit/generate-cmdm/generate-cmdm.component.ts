import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';


@Component({
  selector: 'app-generate-cmdm',
  templateUrl: './generate-cmdm.component.html',
  styleUrls: ['./generate-cmdm.component.css']
})
export class GenerateCMDMComponent implements OnInit {
  @ViewChild('tabset') tabset: any;
  constructor(private route: ActivatedRoute, private router: Router,private modalService: NgbModal,) { }
  passData:any;
  ngOnInit() {
    this.route.params.subscribe(a=>{
      this.passData = a;
      console.log(this.passData)
    })
  }

  onTabChange($event: NgbTabChangeEvent) {
	  if ($event.nextId === 'Exit') {
      $event.preventDefault();
      this.router.navigateByUrl('/acc-s-credit-debit-memo');
      return;
	  }


    if($('.ng-dirty.ng-touched:not([type="search"])').length != 0 ){
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

}
