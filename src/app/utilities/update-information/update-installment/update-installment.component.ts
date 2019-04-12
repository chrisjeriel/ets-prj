import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-update-installment',
  templateUrl: './update-installment.component.html',
  styleUrls: ['./update-installment.component.css']
})
export class UpdateInstallmentComponent implements OnInit {
  searchParams: any[] = [];
  @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
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
  currency: any = "";
  totalPrem: any = "";
  createUser: any = "";
  selected: any;
  fetchedData: any;
  dialogIcon:string;

  passDataInstallmentInfo: any = {
    tableData: [],
    tHeader: ["Inst No", "Due Date", "Booking Date", "Premium Amount", "Comm Rate(%)", "Comm Amount", "Other Charges", "Amount Due"],
    dataTypes: ["number", "date", "date", "currency", "percent", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 1,
    widths: ["1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: {
        instNo: '',
        dueDate: '',
        bookingDate: '',
        premAmt: '',
        commRt: '',
        commAmt: '',
        otherChargesInw: '',
        amtDue: ''
    },
    keys: ['instNo', 'dueDate', 'bookingDate', 'premAmt', 'commRt', 'commAmt', 'otherChrgs', 'amtDue'],
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
    if(this.selected != null) {
      console.log(this.selected);
        this.polNo = this.selected.policyNo.split('-');
        this.policyId = this.selected.policyId;
        this.cedingName = this.selected.cedComp;
        this.insuredDesc = this.selected.insured;
        this.riskName = this.selected.risk;
        this.currency = this.selected.currency;
        this.totalPrem = this.selected.premium;
        this.createUser = this.selected.createUser;

        this.retrievePolInwardBal();
    } else {
      /*this.clearFields();*/
    }
  }

  retrievePolListing(){
       this.underwritingService.getParListing(this.searchParams).subscribe(data => {
         var records = data['policyList'];
          this.fetchedData = records;
               for(let rec of records){
                   if(rec.altNo === 0){
                      if (rec.statusDesc === 'In Force') {
                        console.log(rec);
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
                                                        status: rec.statusDesc,
                                                        createUser: rec.createUser
                                                    }
                                                );  
                     }
                   }
               }
               this.table.forEach(table => { table.refreshTable() });
       });
   }

   retrievePolInwardBal() {
     console.log("retrievePolInwardBal() was called...");
     this.underwritingService.getInwardPolBalance(this.policyId).subscribe((data:any) => {
       console.log(data);
     }); 
   }

   save(can?){
     console.log("save() was called");
     let params:any = {
      policyId:this.policyId,
      savePolInward : [],
      delPolInward : [],
      saveOtherCharges : [],
      delOtherCharges : [],
      newSavePolInward: []
     }

     for(let inst of this.passDataInstallmentInfo.tableData){
       console.log(inst);
      if(inst.edited && !inst.deleted && inst.instNo!==null){
        inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        inst.createDate     = this.ns.toDateTimeString(inst.createDate);
        inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
        inst.updateUser = JSON.parse(window.localStorage.currentUser).username;
        console.log(this.createUser);
        inst.createUser = this.createUser;
        params.savePolInward.push(inst);
      }else if(inst.deleted){
        params.delPolInward.push(inst);
      } /*
      if(!inst.deleted && inst.instNo!==null ){
        let instFlag: boolean = false;
        for(let chrg of inst.otherCharges){
          if(chrg.edited && !chrg.deleted ){
            chrg.createDate     = this.ns.toDateTimeString(chrg.createDate);
            chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
            chrg.updateUser = JSON.parse(window.localStorage.currentUser).username;
            params.saveOtherCharges.push(chrg);
            instFlag = true;
          }else if(chrg.deleted){
            params.delOtherCharges.push(chrg);
            instFlag = true;
          }
        }
        if(instFlag){
          inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
          inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
          inst.createDate     = this.ns.toDateTimeString(inst.createDate);
          inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
          inst.updateUser = JSON.parse(window.localStorage.currentUser).username;
          params.savePolInward.push(inst);
        }
      }
      if(inst.instNo==null){
        inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        for(let chrg of inst.otherCharges){
          chrg.createDate     = this.ns.toDateTimeString(chrg.createDate);
          chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
        }
        params.newSavePolInward.push(inst);
      }*/
    }

     this.underwritingService.saveInwardPolBal(params).subscribe((data:any)=>{
       console.log(data.returnCode);
        if(data.returnCode == -1){
          this.dialogIcon = 'success';
          this.successDialog.open();
          /*this.otherTable.markAsPristine();*/
          /*this.passDataInstallmentInfo.markAsPristine();*/
          this.retrievePolInwardBal();
        }else{
          this.dialogIcon = 'error';
          this.successDialog.open();
        }
      });
    }

}
