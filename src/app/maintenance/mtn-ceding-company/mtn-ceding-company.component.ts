import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompanyListing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-ceding-company',
  templateUrl: './mtn-ceding-company.component.html',
  styleUrls: ['./mtn-ceding-company.component.css']
})
export class MtnCedingCompanyComponent implements OnInit {
  @ViewChild('mdl') modal: ModalComponent;

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any = null;

  passData: any = {
      tableData : [],
      tHeader: ['Co No','Name','Address'],
      dataTypes:['text','text','text'],
      pagination: true,
      pageStatus: true,
      searchFlag: true,
      pageLength: 10,
      resizable: [false,true,false,true,false,false,false],
      filters: [
          {
              key: 'cedingName',
              title:'Name',
              dataType: 'text'
          },
          {
              key: 'address',
              title:'Address',
              dataType: 'text'
          },          
      ],
      pageID: '1232141',
      keys:['cedingId','cedingName','address']
  };

  @Input() lovCheckBox: boolean = false;
  @Input() exclude: any[] = [];
  selects: any[] = [];

  @Input() membershipTag: any = 'N';
  
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal ) { }

  ngOnInit() {
      if(this.lovCheckBox){
        this.passData.checkFlag = true;
      }
  }

  onRowClick(data){  	
    // if(Object.is(this.selected, data)){
   if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null;
    } else {
      this.selected = data;
    }
  }

  okBtnClick(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.passData.tableData.length; i++){
        if(this.passData.tableData[i].checked){
          this.selects.push(this.passData.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModalNotMember(){
    this.passData.tableData = [];

    this.underwritingService.getCedingCompanyList('','','','','','','','Y','',this.membershipTag).subscribe((data: any) => {
         //for(var i=0;i< data.cedingcompany.length;i++){
            // this.passData.tableData.push(new CedingCompanyListing(data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[0],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[0],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[0],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
           /*this.passData.tableData.push({
               cedingId: data.cedingcompany[i].cedingId,
               cedingName: data.cedingcompany[i].cedingName,
               address: data.cedingcompany[i].address
           });*/
         //  this.passData.tableData.push(data.cedingcompany[i]);
         //}
         this.passData.tableData = data.cedingcompany.filter(a=> this.exclude.indexOf(a.cedingId) == -1);
         this.table.refreshTable(); 
     });
  }

  checkCode(code, ev) {    
    if(code.trim() === ''){
      this.selectedData.emit({
        cedingId: '',
        cedingName: '',
        cedingAbbr:'',
        ev: ev,
        singleSearchLov: true
      });
    } else {
      this.underwritingService.getCedingCompanyList(code,'','','','','','','','',this.membershipTag).subscribe(data => {
        if(data['cedingcompany'].length > 0) {
          data['cedingcompany'][0]['ev'] = ev;
          data['cedingcompany'][0]['singleSearchLov'] = true;
          // this.selectedData.emit(new CedingCompanyListing(data['cedingcompany'][0].cedingId,data['cedingcompany'][0].cedingName,data['cedingcompany'][0].cedingAbbr,data['cedingcompany'][0].address,(data['cedingcompany'][0].membershipDate == null ? null : new Date(data['cedingcompany'][0].membershipDate[0],data['cedingcompany'][0].membershipDate[1]-1,data['cedingcompany'][0].membershipDate[2])),(data['cedingcompany'][0].terminationDate == null ? null : new Date(data['cedingcompany'][0].terminationDate[0],data['cedingcompany'][0].terminationDate[1]-1,data['cedingcompany'][0].terminationDate[2])),(data['cedingcompany'][0].inactiveDate == null ? null : new Date(data['cedingcompany'][0].inactiveDate[0],data['cedingcompany'][0].inactiveDate[1]-1,data['cedingcompany'][0].inactiveDate[2]))));
          this.selectedData.emit(data['cedingcompany'][0]);
        } else {
          this.selectedData.emit({
            cedingId: '',
            cedingName: '',
            cedingAbbr:'',
            ev: ev,
            singleSearchLov: true
          });

          // $('#cedingCompanyNotMemberMdl > #modalBtn').trigger('click');
          this.modal.openNoClose();
        }      
      });
   }
  }

  filterDb(params){
    let passToService: any = {};
    for(let param of params){
      passToService[param.key] = param.search
    }

    this.underwritingService.getCedingCompanyList('','','','','','','','Y','','N',passToService).subscribe((data: any) => {
         // for(var i=0;i< data.cedingcompany.length;i++){
         //    // this.passData.tableData.push(new CedingCompanyListing(data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[0],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[0],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[0],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
         //   /*this.passData.tableData.push({
         //       cedingId: data.cedingcompany[i].cedingId,
         //       cedingName: data.cedingcompany[i].cedingName,
         //       address: data.cedingcompany[i].address
         //   });*/
         //   this.passData.tableData.push(data.cedingcompany[i]);
         // }
         this.passData.tableData = data.cedingcompany
         this.table.refreshTable(); 
     });
  }

}
