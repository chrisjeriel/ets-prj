import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OcGenInfoInfo } from '@app/_models/QuotationOcGenInfo';
import { QuotationService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';
import { validateConfig } from '@angular/router/src/config';

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


  constructor(private route: ActivatedRoute, private quotationService: QuotationService, private http: HttpClient) {
   }

  b;
  infos:any = [];
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.from = params['from'];
      if (this.from == "oc-inquiry") {
        this.typeOfCession = params['typeOfCession'];
      }
    });

    this.checkTypeOfCession();

    //this.quotationService.getOcGenInfoData().subscribe(a => this.b = a);
    this.quotationService.getOcGenInfoData().subscribe(val => console.log(val) );

    
    // this.quotationService.getOcGenInfoData()
    // .subscribe((data) =>{
    //   this.infos.push(data);
    // })



  }



  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTypeOfCession() {
    return (this.typeOfCession.trim().toUpperCase() === 'RETROCESSION') ? true : false;
  }
}
