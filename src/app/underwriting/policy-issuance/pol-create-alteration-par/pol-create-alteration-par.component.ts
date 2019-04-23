import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { CreateAlterationParInfo } from '../../../_models/CreateAlterationPolicy';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-pol-create-alteration-par',
  templateUrl: './pol-create-alteration-par.component.html',
  styleUrls: ['./pol-create-alteration-par.component.css']
})
export class PolCreateAlterationPARComponent implements OnInit {
  @ViewChild('altPolLov') lovTable: CustNonDatatableComponent;

  private createAlterationPar: CreateAlterationParInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  fromQuotation: boolean = true;
  policyLine: any;

  polNo: any[] = [];
  searchArr: any[] = Array(6).fill('');;
  cedingName: any = '';
  insuredDesc: any = '';
  riskName: any = '';
  selected: any = null;
  loading: boolean = false;
  warningMsg: any = null;

  passDataLOV: any = {
    tableData: [],
    tHeader:["Policy No", "Ceding Company", "Insured", "Risk"],  
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['policyNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [],
    pageID: 'createAltPolLov'
  }

  constructor(private underwritingService: UnderwritingService, private router: Router,
    private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
    this.getPolListing();
  }


  fromHoldCover() {
    this.fromQuotation = false;
  }

  fromQuotationList() {
    this.fromQuotation = true;
  }

  navigateToGenInfo() {
    var pLine = this.policyLine.toUpperCase();

    if (pLine === 'CAR' ||
      pLine === 'EAR' ||
      pLine === 'EEI' ||
      pLine === 'CEC' ||
      pLine === 'MBI' ||
      pLine === 'BPV' ||
      pLine === 'MLP' ||
      pLine === 'DOS') {
      console.log(this.policyLine);
      this.router.navigate(['/policy-issuance-alt', { line: pLine }], { skipLocationChange: true });
    }
  }

  getPolListing(param?) {
    this.lovTable.loadingFlag = true;
    this.underwritingService.getParListing(param === undefined ? [] : param).subscribe(data => {
      var polList = data['policyList'];

      polList = polList.filter(p => p.statusDesc.toUpperCase() === 'DISTRIBUTED' && p.altNo == 0)
                       .map(p => { p.riskName = p.project.riskName; return p; });
      this.passDataLOV.tableData = polList;
      this.lovTable.refreshTable();

      if(param !== undefined) {
        if(polList.length === 1 && this.polNo.length == 6 && !this.searchArr.includes('%%')) {  
          this.selected = polList[0];
          this.setDetails();
        } else if(polList.length === 0 && this.polNo.length == 6 && !this.searchArr.includes('%%')) {
          this.clearFields();
          this.getPolListing();
          this.showLOV();
        } else if(this.searchArr.includes('%%')) {     
          this.cedingName = '';
          this.insuredDesc = '';
          this.riskName = '';
          this.selected = null;
        }
      }
    });    
  }

  showLOV() {
    $('#altPolLovMdl > #modalBtn').trigger('click');
  }

  onRowClick(event) {    
    if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }    
  }

  setDetails(fromMdl?) {
    if(this.selected != null) {
      this.polNo = this.selected.policyNo.split('-');
      this.cedingName = this.selected.cedingName;
      this.insuredDesc = this.selected.insuredDesc;
      this.riskName = this.selected.riskName;

      if(fromMdl !== undefined) {
        this.searchArr = this.polNo.map((a, i) => {
          return (i == 0) ? a + '%' : (i == this.polNo.length - 1) ? '%' + a : '%' + a + '%';
        });

        this.search('forceSearch',{ target: { value: '' } });
      }
    }
  }

  search(key,ev) {
    var a = ev.target.value;

    if(key === 'lineCd') {
      this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
    } else if(key === 'year') {
      this.searchArr[1] = '%' + a + '%';
    } else if(key === 'seqNo') {
      this.searchArr[2] = '%' + a + '%';
    } else if(key === 'cedingId') {
      this.searchArr[3] = a === '' ? '%%' : '%' + a.padStart(3, '0') + '%';
    } else if(key === 'coSeriesNo') {
      this.searchArr[4] = '%' + a + '%';
    } else if(key === 'altNo') {
      this.searchArr[5] = a === '' ? '%%' : '%' + a;
    }

    if(this.searchArr.includes('')) {
      this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
    }
    
    this.getPolListing([{ key: 'policyNo', search: this.searchArr.join('-') }]);
  }

  clearFields() {
    this.searchArr = Array(6).fill('');
    this.polNo = Array(6).fill('');
    this.cedingName = '';
    this.insuredDesc = '';
    this.riskName = '';
    this.selected = null;

    this.getPolListing();
  }

  checkPolicyAlteration() {
    this.loading = true;
    this.warningMsg = null;    
    this.underwritingService.getAlterationsPerPolicy(this.selected.policyId).subscribe(data => {
      console.log(data);
      var polList = data['policyList'];
      var coIns = data['coInsAlt'];
      
      var a = polList.filter(p => p.statusDesc.toUpperCase() === 'IN PROGRESS' || p.statusDesc.toUpperCase() === 'IN FORCE');
      var b = polList.filter(p => p.statusDesc.toUpperCase() != 'IN PROGRESS' || p.statusDesc.toUpperCase() != 'IN FORCE');

      if(a.length == 0 && coIns != 1) {
        var line = this.polNo[0];

        this.underwritingService.toPolInfo = [];
        this.underwritingService.toPolInfo.push("edit", line);

        if(b.length == 0) {
          //to gen info using base policy          
          this.router.navigate(['/policy-issuance', { line: line, policyNo: this.polNo.join('-'), policyId: this.selected.policyId, editPol: true, alteration: true }], { skipLocationChange: true });
        } else {
          //to gen info using latest alteration from b
          b.sort((a, b) => a.altNo - b.altNo);
          //use b[b.length-1] (max altNo)
          var x = b[b.length-1];
          this.router.navigate(['/policy-issuance', { line: line, policyNo: x.policyNo, policyId: x.policyId, editPol: true, alteration: true }], { skipLocationChange: true });
        }
      } else if(a.length > 0) {
        this.warningMsg = 0;
        this.showWarningMdl();
      } else if(coIns == 1){
        this.warningMsg = 1;
        this.showWarningMdl();
      }

      this.loading = false;
    });
  }

  showWarningMdl() {
    $('#altWarningModal > #modalBtn').trigger('click');
  }
}
