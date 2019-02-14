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
  @Input() cedingId: string = "1";
   
	passDataAttention: any = {
		tableData:[/*
			[true,'Mr.','Henry','I','Tiu','Engg Head','Engineering Insurance','09178348984',null],
			[false,'Ms.','Rose','O','Lim','Acct Head','Accounting','09112233456',null]*/
		],
		tHeader: ['Designation','First Name','M.I.','Last Name','Position','Department','Contact No','E-Signature'],
		dataTypes:['text','text','text','text','text','text','text','text'],
		paginateFlag: true,
		infoFlag: true,
		pageLength: 5,
		widths: ['1','1','1','1','auto','auto','auto','1'],
		pageID: 2,
        keys:['designation' ,'firstName' ,'mI' ,'lastName' ,'position' ,'department' ,'contactNo' ,'eSignature' ]
	}
    selected: any;

  ngOnInit() {
  	this.underwritingService.getCedingCompanyLOV(this.cedingId).subscribe((data:any) => {
            for (var i = 0; i < data.cedingCompany.length; i++) {
                this.passDataAttention.tableData.push(new CedingCompany( data.cedingCompany[i].cedingRepresentative.defaultTag,  data.cedingCompany[i].cedingRepresentative.designation, data.cedingCompany[i].cedingRepresentative.firstName, data.cedingCompany[i].cedingRepresentative.middleInitial, data.cedingCompany[i].cedingRepresentative.lastName, data.cedingCompany[i].cedingRepresentative.position, data.cedingCompany[i].cedingRepresentative.department, data.cedingCompany[i].cedingRepresentative.contactNo, data.cedingCompany[i].cedingRepresentative.eSignature));

            }
            this.table.refreshTable();
        });
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }
}
