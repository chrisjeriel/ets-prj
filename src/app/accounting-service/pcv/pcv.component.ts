import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pcv',
  templateUrl: './pcv.component.html',
  styleUrls: ['./pcv.component.css']
})
export class PcvComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  sub: any;
  action: string;
  record: any = {
      pcvNo: null,
      payee: null,
      pcvType: null,
      status: null,
      pcvDate: null,
      purpose: null,
      curr: null,
      amount: null,
      repFlag: null
    }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      /*this.exitLink = params['link'] !== undefined ? params['link'] : 'adasdas';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';*/

      this.action = params['action'];

      if(this.action == 'edit') {
        this.record = JSON.parse(params['slctd']);
      }
    });

  }

   onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('accounting-service-pcv-listings');
    }
  }

}
