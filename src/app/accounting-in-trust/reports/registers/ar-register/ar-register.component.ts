import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-ar-register',
  templateUrl: './ar-register.component.html',
  styleUrls: ['./ar-register.component.css']
})
export class ArRegisterComponent implements OnInit {

  @ViewChild('paytTypeLov') paytTypeLov : LovComponent;

  dateRadio: string = "1";
  desRadio: string = "1";
  selPaytType: string = "ALL PAYMENT TYPES";
  selPaytMode: string = "ALL PAYMENT MODES";
  tranTypeList: any = [];

  params :any = {
  	reportId: '',
  	reportName : '',
  	tranPostDate: 1,
    fromDate:'',
    toDate:'',
    paytType: '',
    paytMode: '',
    reportType: 'S',
    incClosedTran: 'Y',
    incCancelTran: 'Y',
  }

  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };


  constructor(private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.getAcitTranType();
  }

  getAcitTranType() {
  	this.ms.getAcitTranType('AR', '', '', '', '', 'Y').subscribe((data:any) => {
  		this.tranTypeList = data.tranTypeList;
  	});
  }


  showLov(fromUser){
    console.log(fromUser);

    if(fromUser == 'acitTranType'){
      this.passDataLov.selector = 'acitTranType';
      this.passDataLov.from = 'acit';
      this.paytTypeLov.openLOV();
    }
  }

  setData(data,from){
    setTimeout(() => {
      this.ns.lovLoader(data.ev, 0);
    },0);

    console.log(data.data);

    if(from == 'acitTranType'){
      this.selPaytType   = data.data.description;
      this.params.paytType = data.data.code;
    }

  }

}
