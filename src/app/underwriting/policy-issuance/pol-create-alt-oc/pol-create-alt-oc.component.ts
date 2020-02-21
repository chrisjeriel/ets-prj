import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, ClaimsService } from '../../../_services';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { ModalComponent } from '@app/_components/common'

@Component({
  selector: 'app-pol-create-alt-oc',
  templateUrl: './pol-create-alt-oc.component.html',
  styleUrls: ['./pol-create-alt-oc.component.css']
})
export class PolCreateAltOcComponent implements OnInit {

  constructor(private underwritingService: UnderwritingService, private router: Router,
   public modalService: NgbModal, private titleService: Title, private cs: ClaimsService) { }


  ngOnInit() {
  }

  passDataPolOcLov: any = {
    tableData: [],
    tHeader:["Open Policy No.", "Risk","Ceding Company"],  
    dataTypes: ["text","text","text"],
    pageLength: 10,
    //resizable: [false,false],
    tableOnly: false,
    keys: ['policyNoOc','riskName','cedingName'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'PolOcLov'
  }
  searchParamsPolOcLov:any = {
    'paginationRequest.count':10,
    'paginationRequest.position':1,   
  }

  @ViewChild('polOcLovTable') polOcLovTable : LoadingTableComponent;
  @ViewChild('PolOcLov') polOcLov : ModalComponent;


  polNo: any[] = [];
  cedingName: any;
  insuredDesc: any;
  riskName: any;
  policyIdOc: any;

  showPolOcLOV(){
    this.polOcLov.openNoClose();
    this.searchParamsPolOcLov.lineCd = !this.polNo[0] ? '' : this.polNo[0];
    this.searchParamsPolOcLov.polYear = !this.polNo[1] ? '' : this.polNo[1];
    this.searchParamsPolOcLov.polSeqNo = !this.polNo[2] ? '' : this.polNo[2];
    this.searchParamsPolOcLov.cedingId = !this.polNo[3] ? '' : this.polNo[3];
    this.searchParamsPolOcLov.coSeriesNo = !this.polNo[4] ? '' : this.polNo[4];
    this.searchParamsPolOcLov.altNo = !this.polNo[5] ? '' : this.polNo[5];
    this.underwritingService.getCreateOcAltLov(this.searchParamsPolOcLov).subscribe((a:any)=>{
      this.passDataPolOcLov.count = a.polList.length;
      this.polOcLovTable.placeData(a.polList);
    })
  }

  setPolOcLov(){
    if(this.polOcLovTable.indvSelect != null){
      this.polNo = this.polOcLovTable.indvSelect.policyNoOc.substr(3).split('-');

      this.cedingName  = this.polOcLovTable.indvSelect.cedingName;
      this.insuredDesc  = this.polOcLovTable.indvSelect.insuredDesc;
      this.riskName  = this.polOcLovTable.indvSelect.riskName;
    }
  }

  filterPolOcLov(){
    if(this.polNo.every(a=>!!a) && this.polNo.length == 6 ){
      this.searchParamsPolOcLov.lineCd = !this.polNo[0] ? '' : this.polNo[0];
      this.searchParamsPolOcLov.polYear = !this.polNo[1] ? '' : this.polNo[1];
      this.searchParamsPolOcLov.polSeqNo = !this.polNo[2] ? '' : this.polNo[2];
      this.searchParamsPolOcLov.cedingId = !this.polNo[3] ? '' : this.polNo[3];
      this.searchParamsPolOcLov.coSeriesNo = !this.polNo[4] ? '' : this.polNo[4];
      this.searchParamsPolOcLov.altNo = !this.polNo[5] ? '' : this.polNo[5];
      this.underwritingService.getCreateOcAltLov(this.searchParamsPolOcLov).subscribe((a:any)=>{
        if(a.polList.length == 1){
          this.cedingName  = a.polList[0].cedingName;
	      this.insuredDesc  = a.polList[0].insuredDesc;
	      this.riskName  = a.polList[0].riskName;
	      this.policyIdOc = a.polList[0].policyIdOc;
        }else{
          this.polNo = [];
          this.clearSelected();
          this.showPolOcLOV();
          
        }
      })
    }else{
    	this.clearSelected();
    }
  }

  clearSelected(){
	this.cedingName  = null;
	this.insuredDesc  = null;
	this.riskName  = null;
	this.policyIdOc = null;
  }

  pad(ev,num) {
    var str = ev.target.value;    

    return str === '' ? '' : String(str).padStart(num, '0');
  }

}
