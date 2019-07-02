import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompanyListing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-ceding-company-member',
  templateUrl: './mtn-ceding-company-member.component.html',
  styleUrls: ['./mtn-ceding-company-member.component.css']
})
export class MtnCedingCompanyMemberComponent implements OnInit {
  @ViewChild('mdl') modal: ModalComponent;

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any = null;

  passDataCedingCompanyNotMember: any = {
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
              key: 'coNo',
              title:'Company No',
              dataType: 'text'
          },
          {
              key: 'name',
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
  selects: any[] = [];
  searchParams: any[] =[];
  
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal ) { }

  ngOnInit() {
      if(this.lovCheckBox){
        this.passDataCedingCompanyNotMember.checkFlag = true;
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
      for(var i = 0; i < this.passDataCedingCompanyNotMember.tableData.length; i++){
        if(this.passDataCedingCompanyNotMember.tableData[i].checked){
          this.selects.push(this.passDataCedingCompanyNotMember.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModalNotMember(){
    this.passDataCedingCompanyNotMember.tableData = [];

    this.underwritingService.getCedingCompanyList('','','','','','','','','','').subscribe((data: any) => {
        console.log(data)
         for(var i=0;i< data.cedingcompany.length;i++){
         	if(data.cedingcompany[i].membershipTag === 'Y'){
         		this.passDataCedingCompanyNotMember.tableData.push(data.cedingcompany[i]);
         	}
         }
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
      this.underwritingService.getCedingCompanyList(code,'','','','','','','','','').subscribe(data => {
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

}
