import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { MtnSectionCovers } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
@Component({
  selector: 'app-mtn-section-covers',
  templateUrl: './mtn-section-covers.component.html',
  styleUrls: ['./mtn-section-covers.component.css']
})
export class MtnSectionCoversComponent implements OnInit {
  @ViewChild('sectionCoverModal') modal: ModalComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Input() lineCd: string = "";
  @Input() coverCd: string = "";
  @Input() hideSectionCoverArray: any[] = [];
  selected: any;
  fromInput: boolean = false;
  sectionCover: any = {
    tableData: [],
    tHeader: ['Section','Bullet No','Cover Code','Cover Name'],
    dataTypes: ['text', 'text','sequence-3','text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    colSize:['59px','69px','81px','180px'],
    keys:['section','bulletNo','coverCd','coverName']
  };

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
    if(this.lovCheckBox){
      this.sectionCover.checkFlag = true;
    }
  }

  select(data){
      this.selected = data;
  }

  okBtnClick(){
    this.selected['fromLOV'] = true;
    
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.sectionCover.tableData.length; i++){
        if(this.sectionCover.tableData[i].checked){
          this.selects.push(this.sectionCover.tableData[i]);
        }
      }
      console.log(this.selects)
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    if(!this.fromInput) {
      this.table.refreshTable("try");
      this.sectionCover.tableData = [];
      this.maintenanceService.getMtnSectionCovers(this.lineCd,this.coverCd).subscribe((data: any) =>{
        /*console.log(data.sectionCovers.filter((a)=>{return this.hideSectionCoverArray.indexOf(parseInt(a.coverCd))==-1}));
        console.log(this.hideSectionCoverArray)*/
        this.sectionCover.tableData = data.sectionCovers.filter((a)=>{return this.hideSectionCoverArray.indexOf(a.coverCd)==-1})
         this.table.refreshTable();
      });
    } else {
      this.fromInput = false;
    }
        

  }

  checkCode(code, ev) {
    var obj =  {
      section: '',
      bulletNo: '',
      coverCd: '',
      coverCdAbbr: '',
      ev: ev,
      singleSearchLov: true
    }

    if(code === ''){
      var arr = [];
      arr.push(obj);

      this.selectedData.emit(arr);
    } else {
      this.maintenanceService.getMtnSectionCoversLov(this.lineCd,code).subscribe((data: any) =>{
        data['sectionCovers'] = data['sectionCovers'].filter((a)=>{return ev.filter.indexOf(a.coverCd)==-1});

        if(data['sectionCovers'].length == 1) {          
          data['sectionCovers'][0]['ev'] = ev;
          data['sectionCovers'][0]['singleSearchLov'] = true;

          var arr = [];
          arr.push(data['sectionCovers'][0]);

          this.selectedData.emit(arr);
        } else if(data['sectionCovers'].length > 1) {
          this.fromInput = true;

          var arr = [];
          arr.push(obj);

          this.selectedData.emit(arr);
          
          this.sectionCover.tableData = data['sectionCovers'];
          this.table.refreshTable();

          this.modal.openNoClose();
        } else {
          var arr = [];
          arr.push(obj);

          this.selectedData.emit(arr);
            
          this.modal.openNoClose();
        }
        
      });  
    }
  }
}
