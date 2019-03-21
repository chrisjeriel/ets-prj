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
  fromInput: boolean = false;
  sectionCover: any = {
    tableData: [],
    tHeader: ['Section','Bullet No','Cover Code','Cover Code Name','Add SI'],
    dataTypes: ['text', 'text','sequence-3','text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    keys:['section','bulletNo','coverCd','coverCdAbbr','addSi']
  };
  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	
  }

  select(data){
      this.selected = data;
  }

  okBtnClick(){
    this.selected['fromLOV'] = true;
    this.selectedData.emit(this.selected);
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
    if(code === ''){
      this.selectedData.emit({
        section: '',
        bulletNo: '',
        coverCd: '',
        coverCdAbbr: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getMtnSectionCoversLov(this.lineCd,code).subscribe((data: any) =>{
        console.log(data);
        data['sectionCovers'] = data['sectionCovers'].filter((a)=>{return ev.filter.indexOf(a.coverCd)==-1});
        console.log(data);

        if(data['sectionCovers'].length == 1) {          
          data['sectionCovers'][0]['ev'] = ev;
          this.selectedData.emit(data['sectionCovers'][0]);
        } else if(data['sectionCovers'].length > 1) {
          this.fromInput = true;
          this.selectedData.emit({
            section: '',
            bulletNo: '',
            coverCd: '',
            coverCdAbbr: '',
            ev: ev
          });

          
          this.sectionCover.tableData = data['sectionCovers'];
          // this.hideSectionCoverArray = ev.filter;
          this.table.refreshTable();

          $('#sectionCovers > #modalBtn').trigger('click');
        } else {
          this.selectedData.emit({
            section: '',
            bulletNo: '',
            coverCd: '',
            coverCdAbbr: '',
            ev: ev
          });
            
          $('#sectionCovers > #modalBtn').trigger('click');
        }
        
      });  
    }
  }
}
