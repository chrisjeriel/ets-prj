import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-update-installment',
  templateUrl: './update-installment.component.html',
  styleUrls: ['./update-installment.component.css']
})
export class UpdateInstallmentComponent implements OnInit {
  searchParams: any[] = [];
  @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
  selectedPolicy: any = null;
  polNo: any[] = [];
  policyId: any = "";
  condition: any = "";
  cedingName: any = "";
  insuredDesc: any = "";
  riskName: any = "";
  inceptionDate: any = "";
  inceptionTime: any = "";
  expiryDate: any = "";
  expiryTime: any = "";
  selected: any;
  fetchedData: any;

  passDataInstallmentInfo: any = {
    tableData: [["1", "2019-01-12", "01/01/2019", "300000", "3.2", "500000", "100000", "200000"]],
    tHeader: ["Inst No", "Due Date", "Booking Date", "Premium Amount", "Comm Rate(%)", "Comm Amount", "Other Charges", "Amount Due"],
    dataTypes: ["number", "date", "date", "currency", "percent", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 1,
    widths: ["1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: [null, null, null, null, null, null, null, null],
    pageLength: 5
  };

  passDataOtherCharges: any = {
    tableData: [["101", "Description 101", "50000"]],
    tHeader: ["Code", "Charge Description", "Amount"],
    dataTypes: ["text", "text", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 2,
    nData: [null, null, null],
    magnifyingGlass: ['0'],
    pageLength: 5
  };

  passDataLOV: any = {
    tableData: [],
    tHeader:["Policy No", "Ceding Company", "Insured", "Risk"],  
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['policyNo','cedComp','insured','risk'],
    // keys: ['openPolicyNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'createPolLov'
  }

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal,private ns: NotesService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Update Installment");

    this.retrievePolListing();
  }

  showLOV() {
    $('#polLovMdl > #modalBtn').trigger('click');
  }

  onRowClick(event){
     if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }   
  }

  setDetails() {
    console.log(this.selected);
    if(this.selected != null) {
        this.polNo = this.selected.policyNo.split('-');
        this.policyId = this.selected.policyId;
        this.cedingName = this.selected.cedComp;
        this.insuredDesc = this.selected.insured;
        this.riskName = this.selected.risk;
    } else {
      /*this.clearFields();*/
    }
  }

  retrievePolListing(){
       this.underwritingService.getParListing(this.searchParams).subscribe(data => {
         var records = data['policyList'];
          this.fetchedData = records;
               for(let rec of records){
                 console.log(rec);
                   if(rec.altNo === 0){
                      if (rec.statusDesc === 'In Force' || rec.statusDesc === 'In Progress' || rec.statusDesc === 'Approved' || rec.statusDesc === 'Pending Approval' || rec.statusDesc === 'Rejected') {
                         this.passDataLOV.tableData.push(
                                                    {
                                                        policyId: rec.policyId,
                                                        policyNo: rec.policyNo,
                                                        cessionDesc: rec.cessionDesc,
                                                        cedComp: rec.cedingName, 
                                                        insured: rec.insuredDesc,
                                                        risk: (rec.project == null) ? '' : rec.project.riskName,
                                                        object: (rec.project == null) ? '' : rec.project.objectDesc,
                                                        site: (rec.project == null) ? '' : rec.project.site,
                                                        currency: rec.currencyCd,
                                                        sumInsured: (rec.project.coverage == null) ? '' : rec.project.coverage.totalSi,
                                                        premium: (rec.project.coverage == null) ? '' : rec.project.coverage.totalPrem,
                                                        issueDate: this.ns.toDateTimeString(rec.issueDate),
                                                        inceptDate: this.ns.toDateTimeString(rec.inceptDate),
                                                        expiryDate: this.ns.toDateTimeString(rec.expiryDate),
                                                        accDate: this.ns.toDateTimeString(rec.acctDate),
                                                        status: rec.statusDesc
                                                    }
                                                );  
                     }
                   }
               }
                this.table.forEach(table => { table.refreshTable() });
       });
   }

}
