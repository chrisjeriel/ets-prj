import { Component, OnInit, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-distribution-by-risk',
  templateUrl: './distribution-by-risk.component.html',
  styleUrls: ['./distribution-by-risk.component.css']
})
export class DistributionByRiskComponent implements OnInit, OnDestroy {
  @ViewChild('treaty') treatyTable: CustEditableNonDatatableComponent;
  @ViewChild('limit') limitTable: CustEditableNonDatatableComponent;
  @ViewChild('poolDistTable') poolDistTable: CustEditableNonDatatableComponent;
  @ViewChild('coInsTable') coInsTable: CustEditableNonDatatableComponent;
  @ViewChild('wparam') wparam: CustEditableNonDatatableComponent;

  @Output() riskDistId = new EventEmitter<any>();
  @Output() riskDistStatus = new EventEmitter<any>();

  private polDistributionByRisk: DistributionByRiskInfo;
  // tableData: any[] = [];
  // tHeader: any[] = [];
  // dataTypes: any[] = [];
  nData: DistributionByRiskInfo = new DistributionByRiskInfo(null, null, null, null, null, null);

  tableData: any[] = [];
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  options: any[] = [];
  dataTypes: any[] = [];
  opts: any[] = [];
  checkFlag;
  selectFlag;
  addFlag;
  editFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  searchFlag;
  distFlag = 'treaty'; /*Values : treaty, pool, coinsurance*/

  checkboxFlag;
  columnId;
  pageLength = 10;

  editedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  passDataLimits: any = {
        tHeader: ["Treaty Name", "Amount"],
        dataTypes: [
                    "text", "number"
                   ],
        tableData: [["Quota & 1st Surplus","1,500,000,000.00"],["2nd Surplus","1,500,000,000.00"]],
        pageLength:2
    };

  poolData: any = [["Quota & 1st Surplus","1,500,000,000.00"],
                   ["2nd Surplus","1,500,000,000.00"]];


  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {},
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  //NECO 06/03/2019
  treatyDistData: any = {
    tableData: [],
    tHeader: ['Treaty', 'Treaty Company', 'Treaty Share (%)', 'SI Amount', 'Premium Amount', 'Comm Rate (%)', 'Comm Amt', 'VAT on R/I Comm', 'Net Due'],
    magnifyingGlass: [],
    options: [],
    dataTypes: ['text', 'text', 'percent', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
    keys: ['treatyName', 'trtyCedName', 'pctShare', 'siAmt', 'premAmt', 'commRt', 'commAmt', 'vatRiComm', 'netDue'],
    opts: [],
    total:[null, 'TOTAL', 'pctShare', 'siAmt', 'premAmt', null, 'commAmt', 'vatRiComm', 'netDue'],
    uneditable:[true,true,true,true,true,true,true,true,true],
    nData: {},
    checkFlag: true,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: [],
    pageID: 'treatyDistTable'
  };

  limitsData: any = {
    tableData: [],
    tHeader: ['Treaty Name', 'Amount'],
    magnifyingGlass: [],
    options: [],
    dataTypes: ['text', 'currency'],
    keys: ['treatyName', 'amount'],
    uneditable: [true,true],
    opts: [],
    nData: {},
    selectFlag: false,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 3,
    widths: [],
    pageID: 'treatyLimitsTable'
  };

  wparamData: any = {
    tableData: [],
    tHeader: ['Treaty', 'Treaty Company', 'Treaty Share (%)', 'Comm Rate (%)'],
    magnifyingGlass: [],
    options: [],
    dataTypes: ['text', 'text', 'percent', 'percent'],
    keys: ['treatyName', 'trtyCedName', 'pctShare', 'commRt'],
    opts: [],
    nData: {},
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: [],
    pageID: 'treatyDistTable',
    genericBtn: 'Delete'
  }

  poolDistributionData: any = {
    tableData: [],
    tHeader: ['Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amt', 'VAT on R/I Comm', 'Net Due'],
    dataTypes: ['text', 'text', 'number', 'currency', 'currency', 'number', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
    keys: ['treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
    widths: [1,250,1,140,140,1,140,140,1,140,140,140],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true],
    total:[null,'TOTAL','retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', null, 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    pageID: 'poolDistTable'
  }

  coInsuranceData: any = {
    tableData: [],
    tHeader: ['Risk Dist No', 'Dist No', 'Policy No', 'Ceding Company', 'Share (%)', 'SI Amount', 'Premium Amount'],
    dataTypes: ['sequence-5', 'sequence-5', 'text', 'text', 'percent', 'currency', 'currency'],
    keys: ['riskDistId', 'distId', 'policyNo', 'cedingName', 'pctShare', 'siAmt', 'premAmt'],
    widths: [1,1,160,250,100,140,140],
    uneditable: [true,true,true,true,true,true,true],
    infoFlag: true,
    paginateFlag: true,
    pageID: 'distCoInsTable'
  }

  //END

  passDataPool: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    paginateFlag: false,
    infoFlag: false,
    searchFlag: false,
    checkboxFlag: false,
    pageLength: 10,
    widths: []
  };

  passDataCoInsurance: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

 /* mdlConfig = {
        mdlBtnAlign: "center",
    };*/

    //NECO 05/31/2019
    params: any;
    riskDistributionData: any;
    sub: any;
    //END

  constructor(private polService: UnderwritingService, private titleService: Title, private modalService: NgbModal, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.titleService.setTitle("Pol | Risk Distribution");

    this.sub = this.route.params.subscribe((data: any)=>{
                  this.params = data;
                  this.retrieveRiskDistribution();
                });

    /*this.tHeader.push("Treaty");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Share (%)");
    this.tHeader.push("Comm Rate (%)");
    this.tHeader.push("Line");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("percent");
    this.dataTypes.push("percent");
    this.dataTypes.push("text");

    this.tableData = this.polService.getDistByRiskData();*/

    this.passData.tHeader.push("Treaty");
    this.passData.tHeader.push("Treaty Company");
    this.passData.tHeader.push("Share (%)");
    this.passData.tHeader.push("SI Amount");
    this.passData.tHeader.push("Premium Amount");
    this.passData.tHeader.push("Comm Share (%)");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("percent");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");

    this.passData.tableData = this.polService.getDistByRiskData();

    /*POOL*/

    this.passDataPool.tHeader = ["Treaty", "Treaty Company", "1st Ret Line", "1st Ret SI Amt", "1st Ret Prem Amt", "2nd Ret Line", "2nd Ret SI Amt", "2nd Ret Prem Amt"];
    this.passDataPool.tableData = [
                               ["QS","MAPFRE INSULAR","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                               ["QS","RELIANCE","1","200,000.00","62.50","99","19,800,000.00","6,187.50"],
                               ["QS","INSTRA_STRATA","1","200,000.00","62.50","74","14,800,000.00","4,625.00"],
                               ["QS","PHIL_FIRE","1","200,000.00","62.50","48","9,600,000.00","3,000.00"],
                               ["QS","FEDERAL_PHOENIX","1","200,000.00","62.50","99","19,800,000.00","6,187.50"],
                               ["QS","LIBERTY","1","200,000.00","62.50","74","14,800,000.00","4,625.00"],
                               ["QS","ASIA INSURANCE","1","200,000.00","62.50","49","9,800,000.00","3,062.50"],
                               ["QS","MERIDIAN","1","200,000.00","62.50","49","9,800,000.00","3,062.50"],
                               ["QS","BPI/MS","1","200,000.00","62.50","124","24,800,000.00","7,750.00"],
                               ["QS","ASIA UNITED","1","200,000.00","62.50","99","19,800,000.00","6,187.50"]
                              ];
    
    this.passDataPool.dataTypes = ["text", "text", "number", "number", "number", "number", "number", "number"];
    
    this.passDataPool.paginateFlag = true;
    this.passDataPool.infoFlag = true;

    this.passDataPool.widths.push("1","auto","auto","auto","auto","auto","auto","auto");

    /*END POOL*/

    /*CO-INSURANCE*/

    this.passDataCoInsurance.tHeader = ["Risk Dist No", "Dist No", "Policy No", "Ceding Company", "Share (%)", "SI Amount", "Premium Amount"];
    this.passDataCoInsurance.tableData = [
                               ["00001","00001","CAR-2018-00001-099-0001-0000","FLT Prime","100.000000","4,000,000,000.00","62.50"],
                              ];
    this.passDataCoInsurance.dataTypes = ["text", "text", "text", "text", "number", "number", "number"];
    
    this.passDataCoInsurance.addFlag = false;
    this.passDataCoInsurance.deleteFlag = false;

    this.passDataCoInsurance.widths.push("1","1","auto","auto","auto","auto","auto");

    /*END CO-INSURANCE*/
  }

  //NECO 05/31/2019
    retrieveRiskDistribution(){
      this.polService.getRiskDistribution(this.params.policyId, this.params.line, this.params.lineClassCd).subscribe((data: any)=>{
        console.log(data);
        this.riskDistributionData = data.distWrisk;
        this.riskDistId.emit(this.riskDistributionData.riskDistId);
        this.riskDistStatus.emit(this.riskDistributionData.status);
        console.log(this.riskDistributionData.tsiAmt)
        var appendTreatyName: string = '';
        var appendTreatyLimitId: number = 0;
        //var treatyLimitAmt: any;
        this.treatyDistData.tableData = data.distWrisk.distRiskWtreaty;
        this.wparamData.tableData = data.distRiskWparam;
        for(var i of data.wriskLimit){
          if(appendTreatyLimitId === 0){
            appendTreatyName = i.treatyName;
            appendTreatyLimitId = i.treatyLimitId;
          }
          else if(appendTreatyLimitId === i.treatyLimitId){
            appendTreatyName = appendTreatyName.length == 0 ? i.treatyName : appendTreatyName + ' & ' + i.treatyName;
          }else{
            i.treatyName = appendTreatyName;
            this.limitsData.tableData.push(i);
            appendTreatyName = '';
            appendTreatyLimitId = i.treatyLimitId;
          }
        }
        this.treatyTable.refreshTable();
        this.limitTable.refreshTable();
        this.wparam.refreshTable();
        setTimeout(()=>{
          $('input[type=text]').focus();
          $('input[type=text]').blur();
        },0);
      });
    }

    openPoolDistribution(){
      this.poolDistTable.loadingFlag = true;
      this.polService.getPoolDistribution(this.riskDistributionData.riskDistId).subscribe((data: any)=>{
        this.poolDistributionData.tableData = data.poolDistList;
        this.poolDistTable.refreshTable();
        this.poolDistTable.loadingFlag = false;
        setTimeout(()=>{
          $('input[type=text]').focus();
          $('input[type=text]').blur();
        },0);
      });
    }

    openCoInsurance(){
      this.coInsTable.loadingFlag = true;
      this.polService.getDistCoIns(this.riskDistributionData.riskDistId,this.params.policyId).subscribe((data: any)=>{
        this.coInsuranceData.tableData = data.distCoInsList;
        this.coInsTable.refreshTable();
        this.coInsTable.loadingFlag = false;
        setTimeout(()=>{
          $('input[type=text]').focus();
          $('input[type=text]').blur();
        },0);
      });
    }

    pad(str: string, key: string){
      if(key === 'riskDistId'){
        return String(str).padStart(5, '0');
      }
    }

    round(val: number){
      return Math.round(val * 10000000000) / 10000000000;
    }

    ngOnDestroy(){
      this.sub.unsubscribe();
    }
  //END

  onClickViewPoolDist () {
    this.passData.tHeader = ["Treaty", "Treaty Company", "1st Ret Line", "1st Ret SI Amt", "1st Ret Prem Amt", "2nd Ret Line", "2nd Ret SI Amt", "2nd Ret Prem Amt"];
    this.passData.tableData = [
                               ["QS","MAPFRE INSULAR","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                               ["QS","RELIANCE","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                               ["QS","INSTRA_STRATA","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                               ["QS","PHIL_FIRE","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                               ["QS","FEDERAL_PHOENIX","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                               ["QS","LIBERTY","1","200,000.00","62.50","199","39,800,000.00","12,437.50"],
                              ];
    this.passData.dataTypes = ["text", "text", "number", "number", "number", "number", "number", "number"];
    this.distFlag = 'pool';
    this.passData.addFlag = false;
    this.passData.deleteFlag = false;
  }

  onClickViewCoInsurance () {
    this.passData.tHeader = ["Risk Dist No", "Dist No", "Policy No", "Ceding Company", "Share (%)", "SI Amount", "Premium Amount"];
    this.passData.tableData = [
                               ["00001","00001","CAR-2018-00001-099-0001-0000","FLT Prime","100.000000","4,000,000,000.00","62.50"],
                              ];
    this.passData.dataTypes = ["text", "text", "text", "text", "number", "number", "number"];
    this.distFlag = 'coinsurance';
    this.passData.addFlag = false;
    this.passData.deleteFlag = false;
  }

  onClickReturn () {
    this.passData.tHeader = [];
    this.passData.dataTypes = [];

    this.passData.tHeader.push("Treaty");
    this.passData.tHeader.push("Treaty Company");
    this.passData.tHeader.push("Share (%)");
    this.passData.tHeader.push("SI Amount");
    this.passData.tHeader.push("Premium Amount");
    this.passData.tHeader.push("Comm Share");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("percent");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");

    this.passData.tableData = this.polService.getDistByRiskData();
    this.distFlag = 'treaty';
    this.passData.addFlag = true;
    this.passData.deleteFlag = true;
  }

}
