import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-generate-cmdm',
  templateUrl: './generate-cmdm.component.html',
  styleUrls: ['./generate-cmdm.component.css']
})
export class GenerateCMDMComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  passData:any;
  ngOnInit() {
    this.route.params.subscribe(a=>{
      this.passData = a;
      console.log(this.passData)
    })
  }

  onTabChange($event: NgbTabChangeEvent) {
	  if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/acc-s-credit-debit-memo');
	  }
  }

}
