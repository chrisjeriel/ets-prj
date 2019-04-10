import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompany } from '@app/_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-attention',
  templateUrl: './mtn-attention.component.html',
  styleUrls: ['./mtn-attention.component.css']
})
export class MtnAttentionComponent implements OnInit {
 
 @Output() selectedData: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private underwritingService : UnderwritingService) { }
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Input() cedingId: string = "";
  modalOpen: boolean = false;
	passDataAttention: any = {
		tableData:[/*
			[true,'Mr.','Henry','I','Tiu','Engg Head','Engineering Insurance','09178348984',null],
			[false,'Ms.','Rose','O','Lim','Acct Head','Accounting','09112233456',null]*/
		],
		tHeader: ['Designation','First Name','M.I.','Last Name','Position','Department','Contact No','E-Signature'],
		dataTypes:['text','text','text','text','text','text','text','text'],
		pagination: true,
		pageStatus: true,
		pageLength: 5,
		widths: ['1','1','1','1','auto','auto','auto','1'],
		pageID: 16,
        keys:['designation' ,'firstName' ,'middleInitial' ,'lastName' ,'position' ,'department' ,'contactNo' ,'eSignature' ]
	}
    selected: any;

    @Input() lovCheckBox: boolean = false;
    selects: any[] = [];

  ngOnInit() {
  	/*this.underwritingService.getCedingCompanyLOV(this.cedingId).subscribe((data:any) => {
            for (var i = 0; i < data.cedingCompany.length; i++) {
                this.passDataAttention.tableData.push(new CedingCompany( data.cedingCompany[i].cedingRepresentative.defaultTag,  data.cedingCompany[i].cedingRepresentative.designation, data.cedingCompany[i].cedingRepresentative.firstName, data.cedingCompany[i].cedingRepresentative.middleInitial, data.cedingCompany[i].cedingRepresentative.lastName, data.cedingCompany[i].cedingRepresentative.position, data.cedingCompany[i].cedingRepresentative.department, data.cedingCompany[i].cedingRepresentative.contactNo, data.cedingCompany[i].cedingRepresentative.eSignature));

            }
            this.table.refreshTable();
        });*/
        if(this.lovCheckBox){
          this.passDataAttention.checkFlag = true;
        }
  }

  select(data){
      if(Object.entries(data).length !== 0){
        this.selected = data;
      }else{
        this.selected = undefined;
      }
  }

  okBtnClick(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
      this.passDataAttention.tableData = [];
      this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.passDataAttention.tableData.length; i++){
        if(this.passDataAttention.tableData[i].checked){
          this.selects.push(this.passDataAttention.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  cancel(){
      this.passDataAttention.tableData = [];
      this.table.refreshTable();
     //console.log('popped');
  }
  openModal(){
      /*for(var j = 0; j < this.passDataAttention.tableData.length; j++){
        this.passDataAttention.tableData.pop();
      }*/
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.underwritingService.getCedingCompanyLOV(this.cedingId).subscribe((data:any) => {
             console.log(data);
                       for (var i = 0; i < data.cedingCompany.length; i++) {
                        /*   this.passDataAttention.tableData.push(new CedingCompany( data.cedingCompany[i].cedingRepresentative.defaultTag,  data.cedingCompany[i].cedingRepresentative.designation, data.cedingCompany[i].cedingRepresentative.firstName, data.cedingCompany[i].cedingRepresentative.middleInitial, data.cedingCompany[i].cedingRepresentative.lastName, data.cedingCompany[i].cedingRepresentative.position, data.cedingCompany[i].cedingRepresentative.department, data.cedingCompany[i].cedingRepresentative.contactNo, data.cedingCompany[i].cedingRepresentative.eSignature));*/
                           this.passDataAttention.tableData.push({
                                                                  designation:data.cedingCompany[i].cedingRepresentative.designation,
                                                                  firstName: data.cedingCompany[i].cedingRepresentative.firstName,
                                                                  middleInitial: data.cedingCompany[i].cedingRepresentative.middleInitial,
                                                                  lastName: data.cedingCompany[i].cedingRepresentative.lastName,
                                                                  position: data.cedingCompany[i].cedingRepresentative.position,
                                                                  department: data.cedingCompany[i].cedingRepresentative.department,
                                                                  contactNo: data.cedingCompany[i].cedingRepresentative.contactNo,
                                                                  eSignature: data.cedingCompany[i].cedingRepresentative.eSignature

                                                                });

                       }
                       this.table.refreshTable();
                       console.log("attention");
           console.log(this.passDataAttention);
                   });
           
                     this.modalOpen = true;
       }, 100);
      
  }
}
