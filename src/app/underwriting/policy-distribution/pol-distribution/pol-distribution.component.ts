import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-distribution',
  templateUrl: './pol-distribution.component.html',
  styleUrls: ['./pol-distribution.component.css']
})
export class PolDistributionComponent implements OnInit {

  nData: DistributionByRiskInfo = new DistributionByRiskInfo(null, null, null, null, null, null);

  distFlag: any = 'treaty';

  passData: any = {
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

  passDataTreatyCharges: any = {
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
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  passDataPoolDist: any = {
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
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  passDataPoolCharges: any = {
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
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  constructor(private polService: UnderwritingService, private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Distribution");

    this.passData.tHeader.push("Section"); 
    this.passData.tHeader.push("Treaty");
    this.passData.tHeader.push("Treaty Company");
    this.passData.tHeader.push("SI Amount");
    this.passData.tHeader.push("Premium Amount");
    this.passData.tHeader.push("Comm Amount");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");

    this.passData.tableData = [
                               ["I","QS","Munich Re","570,000,000.00","178,125.00","53,437.50"],
                               ["I","QS","PhilNaRe","30,000,000.00","9,375.00","2,812.50"],
                               ["I","QS","Pool","827,000,000.00","258,625.00","77,587.50"],
                               ["I","1Surp","Munich Re","68,780,000.00","21,493.75","5,910.78"],
                               ["I","1Surp","PhilNaRe","3,620,000.00","1,131.25","311.09"],
                               ["I","2Surp","Munich Re","1,425,000,000.00","445,312.50","122,460.94"],
                               ["I","2Surp","PhilNaRe","75,000,000.00","23,437.50","6,445.31"],
                               ["I","Facul","Munich Re","1,000,000,000.00","312,500.00","78,125.00"],
                               ["II","1Surp","Munich Re","129,295.00","0.00","0.00"],
                               ["II","1Surp","PhilNaRe","6,805.00","0.00","0.00"]
                              ];

    this.passData.paginateFlag = true;
    this.passData.infoFlag = true;

    /*TREATY CHARGES*/

    this.passDataTreatyCharges.tHeader = ["Treaty", "Treaty Company", "Charge", "Charge Amount"];
    this.passDataTreatyCharges.tableData = [
                               ["QS","Munich Re","VAT R/I","6,412.50"],
                               ["QS","PhilNaRe","VAT R/I","337.50"],
                               ["QS","Pool","VAT R/I","9,310.50"],
                               ["1Surp","Munich Re","VAT R/I","709.29"],
                               ["1Surp","PhilNaRe","VAT R/I","37.33"],
                               ["2Surp","Munich Re","VAT R/I","14,695.00"],
                               ["2Surp","PhilNaRe","VAT R/I","773.44"],
                               ["Facul","Munich Re","VAT R/I","9,375.00"]
                              ];
    this.passDataTreatyCharges.dataTypes = ["text", "text", "text", "number"];
    this.passDataTreatyCharges.widths.push("1","auto","auto","auto");

    /*END TREATY CHARGES*/

    /*POOL DIST*/

    this.passDataPoolDist.tHeader.push("Section"); 
    this.passDataPoolDist.tHeader.push("Treaty");
    this.passDataPoolDist.tHeader.push("Treaty Company");
    this.passDataPoolDist.tHeader.push("1st Ret SI Amount");
    this.passDataPoolDist.tHeader.push("1st Ret Prem Amt");
    this.passDataPoolDist.tHeader.push("1st Ret Comm Amt");
    this.passDataPoolDist.tHeader.push("2nd Ret SI Amount");
    this.passDataPoolDist.tHeader.push("2nd Ret Prem Amt");
    this.passDataPoolDist.tHeader.push("2nd Ret Comm Amt");

    this.passDataPoolDist.dataTypes.push("text");
    this.passDataPoolDist.dataTypes.push("text");
    this.passDataPoolDist.dataTypes.push("text");
    this.passDataPoolDist.dataTypes.push("number");
    this.passDataPoolDist.dataTypes.push("number");
    this.passDataPoolDist.dataTypes.push("number");
    this.passDataPoolDist.dataTypes.push("number");
    this.passDataPoolDist.dataTypes.push("number");
    this.passDataPoolDist.dataTypes.push("number");

    this.passDataPoolDist.tableData = [
                               ["I","QS","AFP","200,000.00","62.50","18.75","9,800,000.00","3,062.50","53,437.50"],
                               ["I","QS","ALLIEDBANKERS","200,000.00","62.50","18.75","23,800,000.00","7,437.50","2,812.50"],
                               ["I","QS","BF_GEN","200,000.00","62.50","18.75","14,800,000.00","6,625.00","77,587.50"],
                               ["I","QS","CIBELES","200,000.00","62.50","18.75","9,800,000.00","30,625.50","5,910.78"],
                               ["I","QS","COMMONWEALTH","200,000.00","62.50","18.75","19,800,000.00","6,187.50","311.09"],
                               ["I","QS","EMPIRE","200,000.00","62.50","18.75","19,800,000.00","6,187.50","122,460.94"],
                               ["I","QS","GSIS","200,000.00","62.50","18.75","9,800,000.00","30,625.50","6,445.31"],
                               ["I","QS","MALAYAN","200,000.00","62.50","18.75","24,800,000.00","7,750.00","78,125.00"],
                               ["I","QS","BANKERS","200,000.00","62.50","18.75","19,800,000.00","6,187.50","0.00"],
                               ["I","QS","MERCANTILE","200,000.00","62.50","18.75","19,800,000.00","6,187.50","0.00"]
                              ];

    this.passDataPoolDist.paginateFlag = true;
    this.passDataPoolDist.infoFlag = true;

    this.passDataPoolDist.widths.push("1","1","auto","auto","auto","auto","auto","auto","auto");

    /*END POOL DIST*/

    /*POOL CHARGES*/

    this.passDataPoolCharges.tHeader.push("Treaty");
    this.passDataPoolCharges.tHeader.push("Treaty Company");
    this.passDataPoolCharges.tHeader.push("Charge");
    this.passDataPoolCharges.tHeader.push("1st Ret Charge");
    this.passDataPoolCharges.tHeader.push("2nd Ret Charge");

    this.passDataPoolCharges.dataTypes.push("text");
    this.passDataPoolCharges.dataTypes.push("text");
    this.passDataPoolCharges.dataTypes.push("text");
    this.passDataPoolCharges.dataTypes.push("number");
    this.passDataPoolCharges.dataTypes.push("number");

    this.passDataPoolCharges.tableData = [
                               ["QS","MAPFRE INSULAR","VAT R/I","2.25","110.25"],
                               ["QS","RELIANCE","VAT R/I","2.25","267.75"],
                               ["QS","INTRA_STRATA","VAT R/I","2.25","110.25"],
                               ["QS","PHIL_FIRE","VAT R/I","2.25","225.75"],
                               ["QS","FEDERAL PHOENIX","VAT R/I","2.25","85.50"],
                               ["QS","LIBERTY","VAT R/I","2.25","335.25"],
                               ["QS","ASIA INSURANCE","VAT R/I","2.25","222.75"],
                               ["QS","MERIDIAN","VAT R/I","2.25","85.50"],
                               ["QS","BPI/MS","VAT R/I","2.25","335.25"],
                               ["QS","ASIA UNITED","VAT R/I","2.25","2,247.75"],
                              ];

    this.passDataPoolCharges.paginateFlag = true;
    this.passDataPoolCharges.infoFlag = true;

    this.passDataPoolCharges.widths.push("1","auto","auto","auto","auto");

    /*END POOL CHARGES*/
  }

}
