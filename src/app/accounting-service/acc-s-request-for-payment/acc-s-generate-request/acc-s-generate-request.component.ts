import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-acc-s-generate-request',
  templateUrl: './acc-s-generate-request.component.html',
  styleUrls: ['./acc-s-generate-request.component.css']
})
export class AccSGenerateRequestComponent implements OnInit {

  private sub: any;
  rowData: any = {
    reqId : ''
  };

  checkData : any = { 
    tranId : '',
    from : ''
  };

  constructor(private activatedRoute: ActivatedRoute,  private router: Router) { }

 ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      if(Object.keys(params).length != 0){
        console.log(params);
        this.rowData.reqId = params['reqId'];
        this.checkData.from = params['from'];
        this.checkData.tranId = params['tranId'];
      }
    });
  }


  ngOnDestroy(){
  	this.sub.unsubscribe();
  }
  
  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        if(this.checkData.from.toLowerCase() == 'cv-paytreqlist'){
          this.router.navigate(['/generate-cv-service', { tranId : this.checkData.tranId, from: 'acc-s-request-for-payment' }], { skipLocationChange: true });
        }else{
          this.router.navigateByUrl('/acc-s-request-for-payment');
        }
      } 
  }


}
