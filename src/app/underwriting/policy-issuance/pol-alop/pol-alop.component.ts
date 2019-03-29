import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '../../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'


@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  aLOPInfo: ALOPInfo = new ALOPInfo();
  tableData: any[] = [["1", "Description 1", "Information 1"],
  ["2", "Description 2", "Information 2"],
  ["3", "Description 3", "Information 3"],
  ["4", "Description 4", "Information 4"],
  ["5", "Description 5", "Information 5"],
  ];

  tableData2: any[] = [
    ["1", "5", "Description 1", "Information", "Information"],
    ["2", "5", "Description 2", "Information", "Information"],
    ["3", "5", "Description 3", "Information", "Information"],
    ["4", "5", "Description 4", "Information", "Information"],
    ["5", "5", "Description 5", "Information", "Information"],
  ]

  tHeader: string[] = [];
  tHeader2: string[] = [];
  policyRecordInfo: any = {};
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  pageLength = 10;

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    nData: {},
    selectFlag: false,
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };
  passData2: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    nData: {},
    selectFlag: false,
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };
  nData: ALOPItemInformation = new ALOPItemInformation(null, null, null, null, null);
  line: string;
  sub: any;
  policyNo:string = '';
  policyId: string;

  @Input() policyInfo:any = {};
  polAlopData: any={
                     insId: null,
                     insuredName: null,
                     insuredDesc: null,
                     address: null,
                     annSi: null,
                     maxIndemPdSi: null,
                     issueDate: '',
                     expiryDate: '',
                     maxIndemPd: null,
                     indemFromDate: null,
                     timeExc: null,
                     repInterval: null,
                     createUser: null,
                     createDate: null,
                     updateUser: null,
                     updateDate: null
    };
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private route: ActivatedRoute, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
    /*this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
    this.tHeader = ["Item No","Quantity","Description","Relative Importance","Possible Loss Min"];
    this.dataTypes = ["number","number","text","text","text"];
    
    if(this.policyRecordInfo.policyNo.substr(0,3) =="CAR"){
      this.tHeader = ["Item No","Quantity","Description","Possible Loss Min"];
      this.dataTypes = ["number","number","text","text"];
    }

    this.tableData = this.underwritingService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0,3));*/
    this.titleService.setTitle("Pol | ALOP");

    this.passData.tHeader.push("Item No", "Description", "Possible Loss Minimization");
    this.passData.widths.push("1", "auto", "auto");
    this.passData.tableData = this.tableData;


    this.passData2.tHeader.push("Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Minimization");
    this.passData2.dataTypes.push("text", "text", "text", "text", "text");
    this.passData2.widths.push("1", "1", "auto", "auto", "auto");

    this.passData2.tableData = this.tableData2;

    this.policyNo = this.policyInfo.policyNo.split(/[-]/g)[0]

    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
    });

    this.getPolAlop();
    this.getPolAlopItem();

  }

  save() {
    console.log(this.aLOPInfo);
  }

  getPolAlop() {
    
    this.underwritingService.getPolAlop(this.policyInfo.policyId,'').subscribe((data: any) => {

      if (data.policy != null) {
        this.policyId = data.policy.policyId;
        this.polAlopData = data.policy[0].alop[0]===null ? this.polAlopData : data.policy[0].alop[0];
        this.polAlopData.issueDate = this.ns.toDateTimeString(this.polAlopData.issueDate);
        this.polAlopData.expiryDate = this.ns.toDateTimeString(this.polAlopData.expiryDate);
        this.polAlopData.indemFromDate = this.ns.toDateTimeString(this.polAlopData.indemFromDate);
        this.polAlopData.createDate = this.ns.toDateTimeString(this.polAlopData.createDate);
        this.polAlopData.updateDate = this.ns.toDateTimeString(this.polAlopData.updateDate);
      }

    });
  }

  getPolAlopItem() {

    this.underwritingService.getPolAlopItem(this.policyNo, this.policyInfo.policyId, this.policyInfo.policyNo).subscribe((data: any) => {

      this.passData.tableData = [];
      this.passData2.tableData = [];
      
      if (data.policy != null) {
        var dataInfos = data.policy.alop[0].alopItem;

        if(this.policyNo === "CAR") {

          for(var i=0; i< dataInfos.length;i++){
            this.passData.tableData.push([dataInfos[i].itemNo, dataInfos[i].description, dataInfos[i].lossMin]);
          }
        } else {

          for(var i=0; i< dataInfos.length;i++){
            this.passData2.tableData.push([dataInfos[i].itemNo, dataInfos[i].quantity, dataInfos[i].description, 
              dataInfos[i].importance, dataInfos[i].lossMin]);
          }
        }
        
        this.table.refreshTable();
      }
    });

  }

}
