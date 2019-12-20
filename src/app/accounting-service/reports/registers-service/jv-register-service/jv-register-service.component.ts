import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-jv-register-service',
  templateUrl: './jv-register-service.component.html',
  styleUrls: ['./jv-register-service.component.css']
})
export class JvRegisterServiceComponent implements OnInit {

  @ViewChild('paytTypeLov') paytTypeLov : LovComponent;

  dateRadio: string = "1";
  desRadio: string = "1";
  rType: string = "S";
  iCloTag:boolean = true;
  iCanTag:boolean = true;
  tDate: boolean = true;
  pDate: boolean = false;
  tranName: string = "";

  params :any = {
    reportId: 'ACSER060C',
    reportName : 'ACSER060C',
    tranPostDate: 1,
    fromDate:'',
    toDate:'',
    paytType: '',
    paytMode: '',
    reportType: 'S',
    incClosedTran: 'Y',
    incCancelTran: 'Y',
    destination: '',
    chkDate: '',
    jvType: '',
  }

  passDataLov  : any = {
    selector     : ''
  };

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService) { }

  ngOnInit() {
  }

  onClickPrint() {
    this.params.tranPostDate = this.dateRadio;
    this.params.printedBy = this.ns.getCurrentUser();
    this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
    this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
    this.params.reportType = this.rType;

    if (this.rType == "S") {
      this.params.reportId = "ACSER060C";
    } else if (this.rType == "D"){
      this.params.reportId = "ACSER060C_DTL";
    }

    let params :any = {
      "reportId" : this.params.reportId,
      "acser060Params.reportId" : this.params.reportId,
      "acser060Params.reportName" : this.params.reportName,
      "acser060Params.tranPostDate" : this.params.tranPostDate, 
      "acser060Params.fromDate" : this.params.fromDate, 
      "acser060Params.toDate" : this.params.toDate, 
      "acser060Params.paytType" : this.params.paytType, 
      "acser060Params.paytMode" : this.params.paytMode, 
      "acser060Params.reportType" : this.params.reportType, 
      "acser060Params.incClosedTran" : this.params.incClosedTran, 
      "acser060Params.incCancelTran" : this.params.incCancelTran, 
      "acser060Params.destination" : this.params.destination, 
      "acser060Params.printedBy" : this.params.printedBy,
      "acser060Params.chkDate" : this.params.chkDate,
      "acser060Params.jvType" : this.params.jvType,
    }

    console.log(params);

    this.printService.print(this.params.destination,this.params.reportId, params);
  }

  showLov(fromUser){
    console.log(fromUser);

    if(fromUser == 'acseTranType'){
      this.passDataLov.selector = 'acseTranType';
      this.passDataLov.from = 'acse';
      this.passDataLov.params = {
        tranClass: 'JV',
        baeTag: 'N',
        autoTag: 'N'
      }
      this.paytTypeLov.openLOV();
    }
  }

  setData(data,from){
    setTimeout(() => {
      this.ns.lovLoader(data.ev, 0);
    },0);

    console.log(data.data);

    if(from == 'acseTranType'){
      this.params.jvType   = data.data.tranTypeCd;
      this.tranName = data.data.tranTypeName;
    }

  }

}
