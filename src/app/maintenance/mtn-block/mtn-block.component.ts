import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { MtnBlock } from '@app/_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-block',
  templateUrl: './mtn-block.component.html',
  styleUrls: ['./mtn-block.component.css']
})
export class MtnBlockComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private maintenanceService : MaintenanceService) { }

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passDataBlock: any = {
        tableData: [],
        tHeader: ['Region Code', 'Region Description', 'Province Code', 'Province Description', 'City Code', 'City Description', 'District Code', 'District Description', 'Block Code', 'Block Description' ],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text','text','text','text'],
        resizable: [false, true, false, true, true, false, false,true,true,true],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 2,
        keys:[
        	'regionCd',
        	'regionDesc',
        	'provinceCd',
        	'provinceDesc',
        	'cityCd',
        	'cityDesc',
        	'districtCd',
        	'districtDesc',
        	'blockCd',
        	'blockDesc']

    }

    selected: any;
    modalOpen: boolean = false;

    @Input() lovCheckBox: boolean = false;
    selects: any[] = [];



  ngOnInit() {
  	if(this.lovCheckBox){
      this.passDataBlock.checkFlag = true;
    }
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.passDataBlock.tableData.length; i++){
        if(this.passDataBlock.tableData[i].checked){
          this.selects.push(this.passDataBlock.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    this.maintenanceService.getMtnBlock().subscribe((data: any) => {
      console.log(data);
    //   for (var a = 0; a < data.region.length; a++) {
    //     this.passDataBlock.tableData.push(
      //   new MtnBlock(data.region[a].regionCd,
      //          data.region[a].regionDesc, 
      //          data.region[a].province.provinceCd, 
      //          data.region[a].province.provinceDesc,
      //          data.region[a].province.city.cityCd,
      //          data.region[a].province.city.cityDesc,
      //          data.region[a].province.city.district.districtCd,
      //          data.region[a].province.city.district.districtDesc,
      //          data.region[a].province.city.district.block.blockCd,
      //          data.region[a].province.city.district.block.blockDesc )
      // );


        for (var a = 0; a < data.region.length; a++) {
          for (var b = 0; b < data.region[a].provinceList.length; b++) {
            for (var c = 0; c < data.region[a].provinceList[b].cityList.length; c++) {
              for (var d= 0; d < data.region[a].provinceList[b].cityList[c].districtList.length; d++) {
                for (var e= 0; e < data.region[a].provinceList[b].cityList[c].districtList[d].blockList.length; e++) {
                  this.passDataBlock.tableData.push(
                    new MtnBlock(
                           data.region[a].regionCd,
                           data.region[a].regionDesc,
                           data.region[a].provinceList[b].provinceCd,
                           data.region[a].provinceList[b].provinceDesc,
                           data.region[a].provinceList[b].cityList[c].cityCd,
                           data.region[a].provinceList[b].cityList[c].cityDesc,
                           data.region[a].provinceList[b].cityList[c].districtList[d].districtCd,
                           data.region[a].provinceList[b].cityList[c].districtList[d].districtDesc,
                           data.region[a].provinceList[b].cityList[c].districtList[d].blockList[e].blockCd,
                           data.region[a].provinceList[b].cityList[c].districtList[d].blockList[e].blockDesc )
                    );
              }
            }
          }
        }
    }
          
      this.table.refreshTable();
    });
    this.modalOpen = true;
  }

}

