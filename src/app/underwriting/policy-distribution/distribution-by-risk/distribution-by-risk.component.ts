import { Component, OnInit } from '@angular/core';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-distribution-by-risk',
  templateUrl: './distribution-by-risk.component.html',
  styleUrls: ['./distribution-by-risk.component.css']
})
export class DistributionByRiskComponent implements OnInit {

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
        pageLength:2,
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

  constructor(private polService: UnderwritingService, private titleService: Title) { }


  ngOnInit() {
    this.titleService.setTitle("Pol | Risk Distribution");

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
    this.passData.tHeader.push("Comm Share");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("percent");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");

    this.passData.tableData = this.polService.getDistByRiskData();
  }

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
