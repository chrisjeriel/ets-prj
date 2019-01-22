import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generate-jv',
  templateUrl: './generate-jv.component.html',
  styleUrls: ['./generate-jv.component.css']
})
export class GenerateJvComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  exitLink: string;
  exitTab: string;
  sub: any;

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] : 'adasdas';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
  		} 
  
  }

}
