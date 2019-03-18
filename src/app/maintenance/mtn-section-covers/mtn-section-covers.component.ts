import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { MtnSectionCovers } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-section-covers',
  templateUrl: './mtn-section-covers.component.html',
  styleUrls: ['./mtn-section-covers.component.css']
})
export class MtnSectionCoversComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Input() lineCd: string = "";
  @Input() coverCd: string = "";
  @Input() hideSectionCoverArray: any[] = [];
  selected: any;
  sectionCover: any = {
    tableData: [],
    tHeader: ['Section','Bullet No','Cover Code','Cover Code Name'],
    dataTypes: ['text', 'text','sequence-3','text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    colSize:['59px','69px','81px','180px'],
    keys:['section','bulletNo','coverCd','coverCdAbbr']
  };
  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	
    console.log("On Init MTN Section Covers");
  }

  select(data){
      this.selected = data;
  }

  okBtnClick(){
    this.selectedData.emit(this.selected);
  }

  openModal(){
        console.log("MTN Section Covers");
        this.table.refreshTable("try");
        this.sectionCover.tableData = [];
        this.maintenanceService.getMtnSectionCovers(this.lineCd,this.coverCd).subscribe((data: any) =>{
          /*console.log(data.sectionCovers.filter((a)=>{return this.hideSectionCoverArray.indexOf(parseInt(a.coverCd))==-1}));
          console.log(this.hideSectionCoverArray)*/
          this.sectionCover.tableData = data.sectionCovers.filter((a)=>{return this.hideSectionCoverArray.indexOf(a.coverCd)==-1})
           this.table.refreshTable();
        });

  }

  /*checkCode(code, ev) {
    if(code === ''){
      this.selectedData.emit({
        section: '',
        bulletNo: '',
        coverCd: '',
        coverCdAbbr: '',
        addSi: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getMtnSectionCovers(this.lineCd,this.coverCd).subscribe((data: any) =>{  
        if(data['sectionCovers'].length > 0) {
          data['sectionCovers'][0]['ev'] = ev;
          this.selectedData.emit(data['sectionCovers'][0]);
        } else {
          this.selectedData.emit({
            section: '',
            bulletNo: '',
            coverCd: '',
            coverCdAbbr: '',
            addSi: '',
            ev: ev
          });
            
          $('#sectionCovers > #modalBtn').trigger('click');
        }
        
      });  
    }
  }*/
}
