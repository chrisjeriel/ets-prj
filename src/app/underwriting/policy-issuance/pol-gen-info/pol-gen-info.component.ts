import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-gen-info',
  templateUrl: './pol-gen-info.component.html',
  styleUrls: ['./pol-gen-info.component.css']
})
export class PolGenInfoComponent implements OnInit, OnDestroy {

  @Input() mode;
  line: string;
  private sub: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
       this.line = params['line']; 
  	});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}