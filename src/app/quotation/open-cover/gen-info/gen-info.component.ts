import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gen-info',
  templateUrl: './gen-info.component.html',
  styleUrls: ['./gen-info.component.css']
})
export class GenInfoComponent implements OnInit {

  quotationNum: any[] = [];
  typeOfCession: string = "";
  line: string;
  private sub: any;


  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.typeOfCession = params['typeOfCession'];
      console.log(this.typeOfCession);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
