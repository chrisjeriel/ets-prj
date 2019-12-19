import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
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
  rType: string = "S";
  iCloTag:boolean = true;
  iCanTag:boolean = true;

  params :any = {
  	reportId: 'ACITR061A',
  	reportName : 'ACITR061A',
  	tranPostDate: 1,
    fromDate:'',
    toDate:'',
    paytType: '',
    paytMode: '',
    reportType: 'S',
    incClosedTran: 'Y',
    incCancelTran: 'Y',
    destination: ''
  }

  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };


  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService) { }

  ngOnInit() {
  }

  showLov(fromUser){
    console.log(fromUser);

    if(fromUser == 'acitTranType'){
      this.passDataLov.selector = 'acitTranType';
      this.passDataLov.from = 'acit';
      this.passDataLov.params = {
        tranClass: 'AR'
      }
      this.paytTypeLov.openLOV();
    }
  }

  setData(data,from){
    setTimeout(() => {
      this.ns.lovLoader(data.ev, 0);
    },0);

    console.log(data.data);

    if(from == 'acitTranType'){
      this.selPaytType   = data.data.tranTypeName;
      this.params.paytType = data.data.tranTypeCd;
    }

  }

  onClickPrint() {
    this.params.tranPostDate = this.dateRadio;
    this.params.printedBy = this.ns.getCurrentUser();
    this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
    this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
    this.params.reportType = this.rType;

    if (this.rType == "S") {
      this.params.reportId = "ACITR061A";
    } else if (this.rType == "D"){
      this.params.reportId = "ACITR061A_DTL";
    }

    let params :any = {
      "reportId" : this.params.reportId,
      "acitr061Params.reportId" : this.params.reportId,
      "acitr061Params.reportName" : this.params.reportName,
      "acitr061Params.tranPostDate" : this.params.tranPostDate, 
      "acitr061Params.fromDate" : this.params.fromDate, 
      "acitr061Params.toDate" : this.params.toDate, 
      "acitr061Params.paytType" : this.params.paytType, 
      "acitr061Params.paytMode" : this.params.paytMode, 
      "acitr061Params.reportType" : this.params.reportType, 
      "acitr061Params.incClosedTran" : this.params.incClosedTran, 
      "acitr061Params.incCancelTran" : this.params.incCancelTran, 
      "acitr061Params.destination" : this.params.destination, 
      "acitr061Params.printedBy" : this.params.printedBy
    }

    console.log(params);

    this.printService.print(this.params.destination,this.params.reportId, params);
  }

}
