import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gen-info',
  templateUrl: './gen-info.component.html',
  styleUrls: ['./gen-info.component.css']
})
export class GenInfoComponent implements OnInit {

  typeOfCession: string = "";
  line: string;
  private sub: any;
  from: string;

  currencyAbbr: string = "";
  currencyRt: number = 0;

  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.from = params['from'];
      if (this.from == "oc-inquiry") {
        this.typeOfCession = params['typeOfCession'];
      }
    });

    this.checkTypeOfCession();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTypeOfCession() {
    return (this.typeOfCession.trim().toUpperCase() === 'RETROCESSION') ? true : false;
  }

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
  }

  setCurrency(data){
    this.currencyAbbr = data.currencyAbbr;
    this.currencyRt = data.currencyRt;
  }
}
