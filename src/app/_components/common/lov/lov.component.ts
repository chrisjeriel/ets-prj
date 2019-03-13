import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MaintenanceService, UnderwritingService, QuotationService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LovComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild(ModalComponent) modal : ModalComponent;
  passTable: any = {
        tableData: [],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'LOV',
    }

  @Input()
  passData: any = {
  	selector:'',
  	data:{}
  }

  modalOpen: boolean = false;


  constructor(private modalService: NgbModal, private mtnService : MaintenanceService, private underwritingService: UnderwritingService, private quotationService: QuotationService) { }

  ngOnInit() {
  	  	
  }

  select(data){
  	  this.passData.data = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.passData);
  }

  checkCode(selector?,regionCd?, provinceCd?, cityCd?, districtCd?, blockCd?, ev?) {

    console.log("checkCode in lov component");

    if (selector == 'region') {
      if (regionCd === '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnRegion(regionCd).subscribe((data: any) => {
            if(data.region.length > 0) {
              data.region[0]['ev'] = ev;
              data.region[0]['selector'] = selector;
              this.selectedData.emit(data['region'][0]);
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });
              this.passData.regionCd = '';
              this.passData.selector = 'region';
              $('#lovMdl > #modalBtn').trigger('click');
            }
        });
      }
    } else if (selector == 'province') {
      if (provinceCd === '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnProvince(regionCd, provinceCd).subscribe((data: any) => {
            if(data.region.length > 0) {
              data.region[0]['ev'] = ev;
              data.region[0]['selector'] = selector;
              this.selectedData.emit(data['region'][0]);
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });

              this.passData.regionCd = regionCd;
              this.passData.selector = 'province';
              $('#lovMdl > #modalBtn').trigger('click');
            }
        });
      }
    } else if (selector == 'city') {
      if (cityCd === '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnCity(regionCd, provinceCd, cityCd).subscribe((data: any) => {
            if(data.region.length > 0) {
              data.region[0]['ev'] = ev;
              data.region[0]['selector'] = selector;
              this.selectedData.emit(data['region'][0]);
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });

              this.passData.regionCd = regionCd;
              this.passData.provinceCd = provinceCd;
              this.passData.selector = 'city';
              $('#lovMdl > #modalBtn').trigger('click');
            }
        });
      }
    } else if (selector == 'district') {
      if (districtCd === '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnDistrict(regionCd, provinceCd, cityCd, districtCd).subscribe((data: any) => {
            if(data.region.length > 0) {
              data.region[0]['ev'] = ev;
              data.region[0]['selector'] = selector;
              this.selectedData.emit(data['region'][0]);
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });

              this.passData.regionCd = regionCd;
              this.passData.provinceCd = provinceCd;
              this.passData.cityCd = cityCd;
              this.passData.selector = 'district';
              $('#lovMdl > #modalBtn').trigger('click');
            }
        });
      }
    } else if (selector == 'block') {
      if (blockCd === '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnBlock(regionCd, provinceCd, cityCd, districtCd, blockCd).subscribe((data: any) => {
            if(data.region.length > 0) {
              data.region[0]['ev'] = ev;
              data.region[0]['selector'] = selector;
              this.selectedData.emit(data['region'][0]);
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });

              this.passData.regionCd = regionCd;
              this.passData.provinceCd = provinceCd;
              this.passData.cityCd = cityCd;
              this.passData.districtCd = districtCd;
              this.passData.selector = 'block';
              $('#lovMdl > #modalBtn').trigger('click');
            }
        });
      }
    }


    /*if(districtCd === ''){
      this.selectedData.emit({
        data: null,
        ev: ev
      });
    } else {
      this.mtnService.getMtnDistrict(regionCd, provinceCd, cityCd, districtCd).subscribe(data => {
        console.log("Data from LOV: " + JSON.stringify(data['region'][0]));
        if(data['region'].length > 0) {
          data['region'][0]['ev'] = ev;
          this.selectedData.emit(data['region'][0]);
        } else {
          this.selectedData.emit({
            districtCd: '',
            description: '',
            ev: ev
          });
            
          $('#districtMdl > #modalBtn').trigger('click');
        }
        
      });  
    }*/
  }

  openModal(){
    this.passTable.tableData = [];
  	if(this.passData.selector == 'insured'){
  		this.passTable.keys = ['insuredId', 'insuredName' ];
      this.passTable.tHeader =  ['Insured Id', 'Insured Name' ];
      this.passTable.dataTypes =  ['text', 'text', 'text', 'text', 'text', 'text', 'text'];
	    this.mtnService.getMtnInsured('').subscribe((data: any) => {
	          for (var a =0 ; data.insured.length > a; a++) {
	            this.passTable.tableData.push(data.insured[a]);
	          }
	          this.table.refreshTable();
	        });
	  }else if(this.passData.selector == 'city'){
      this.passTable.tHeader =  ['Region Code', 'Region Description', 'Province Code', 'Province Description', 
                'City Code', 'City Description', 'Remarks', 'Zone Code', 'Zone Description' ];
      this.passTable.dataTypes =  ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'];
      this.passTable.keys = [
            'regionCd',
            'regionDesc',
            'provinceCd',
            'provinceDesc',
            'cityCd',
            'cityDesc',
            'remarks',
            'zoneCd',
            'zoneDesc'];
      this.mtnService.getMtnCity(this.passData.regionCd,this.passData.provinceCd).subscribe((data: any) =>{
        //console.log(data);
        for(var regionCount = 0; regionCount < data.region.length; regionCount++){
          for(var provinceCount = 0; provinceCount < data.region[regionCount].provinceList.length; provinceCount++){
            for(var cityCount = 0; cityCount < data.region[regionCount].provinceList[provinceCount].cityList.length; cityCount++){
              let row :any = new Object();
              row.regionCd = data.region[regionCount].regionCd;
              row.regionDesc = data.region[regionCount].regionDesc;
              row.provinceCd = data.region[regionCount].provinceList[provinceCount].provinceCd;
              row.provinceDesc = data.region[regionCount].provinceList[provinceCount].provinceDesc;
              row.cityCd = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].cityCd;
              row.cityDesc = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].cityDesc;
              row.remarks = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].remarks;
              row.zoneCd = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].zoneCd;
              row.zoneDesc = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].zoneDesc;
              this.passTable.tableData.push(row);
            }
          }
        }
        this.table.refreshTable();
        //console.log(this.cityListing.tableData);
      });

    }else if(this.passData.selector == 'district'){
      this.passTable.tHeader = ['Region Code', 'Region Description', 'Province Code', 'Province Description', 'City Code', 'City Description', 'District Code', 'District Description', ];
      this.passTable.dataTypes = ['text', 'text', 'text', 'text', 'text', 'text', 'text'];
      this.passTable.keys = [
                'regionCd',
                'regionDesc',
                'provinceCd',
                'provinceDesc',
                'cityCd',
                'cityDesc',
                'districtCd',
                'districtDesc'];
      this.mtnService.getMtnDistrict(this.passData.regionCd,this.passData.provinceCd,this.passData.cityCd).subscribe((data: any) => {
        console.log(data);
        for (var a = 0; a < data.region.length; a++) {
          for (var b = 0; b < data.region[a].provinceList.length; b++) {
            for (var c = 0; c < data.region[a].provinceList[b].cityList.length; c++) {
              for (var d= 0; d < data.region[a].provinceList[b].cityList[c].districtList.length; d++) {
                let row : any = new Object();
                row.regionCd = data.region[a].regionCd;
                row.regionDesc = data.region[a].regionDesc;
                row.provinceCd = data.region[a].provinceList[b].provinceCd;
                row.provinceDesc = data.region[a].provinceList[b].provinceDesc;
                row.cityCd = data.region[a].provinceList[b].cityList[c].cityCd;
                row.cityDesc = data.region[a].provinceList[b].cityList[c].cityDesc;
                row.zoneCd = data.region[a].provinceList[b].cityList[c].zoneCd;
                row.zoneDesc = data.region[a].provinceList[b].cityList[c].zoneDesc;
                row.districtCd = data.region[a].provinceList[b].cityList[c].districtList[d].districtCd;
                row.districtDesc = data.region[a].provinceList[b].cityList[c].districtList[d].districtDesc;
                this.passTable.tableData.push(row);
              }
            }
          }
        }
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'deductibles'){
      this.passTable.tHeader = [ 'Deductible', 'Title', 'Deductible Type', 'Rate', 'Deductible Amount','Deductible Text'];
      this.passTable.dataTypes = [ 'text', 'text', 'text', 'percent', 'currency'];
      this.passTable.keys = ['deductibleCd','deductibleTitle','deductibleType','deductibleRate','deductibleAmt','deductibleText'];
      this.underwritingService.getMaintenanceDeductibles(this.passData.lineCd,
        this.passData.params.deductibleCd,this.passData.params.coverCd,this.passData.params.endtCd,this.passData.params.activeTag,
        this.passData.params.defaultTag
        ).subscribe((data: any) => {
          this.passTable.tableData = data.deductibles.filter((data)=>{return  this.passData.hide.indexOf(data.deductibleCd)==-1});
          this.table.refreshTable();
      });
    }else if(this.passData.selector == 'region'){
      this.passTable.tHeader = [ 'Region Code', 'Region Description','Remarks'];
      this.passTable.dataTypes = [ 'text', 'text', 'text'];
      this.passTable.keys = ['regionCd','regionDesc','remarks'];
      this.mtnService.getMtnRegion().subscribe((data: any) => {
          this.passTable.tableData = data.region;
          this.table.refreshTable();
      });
    }
    else if(this.passData.selector == 'province'){
      this.passTable.tHeader = [ 'Region Code', 'Region Description', 'Province Code', 'Province Description','Remarks'];
      this.passTable.dataTypes = [ 'text', 'text', 'text'];
      this.passTable.keys = ['regionCd','regionDesc','provinceCd','provinceDesc','remarks'];
      this.mtnService.getMtnProvince(this.passData.regionCd).subscribe((data: any) => {
        console.log(data);
          for (var a = 0; a < data.region.length; a++) {
            for (var b = 0; b < data.region[a].provinceList.length; b++) {
              let row : any = new Object();
                row.regionCd = data.region[a].regionCd;
                row.regionDesc = data.region[a].regionDesc;
                row.provinceCd = data.region[a].provinceList[b].provinceCd;
                row.provinceDesc = data.region[a].provinceList[b].provinceDesc;
                row.remarks = data.region[a].provinceList[b].remarks;
                this.passTable.tableData.push(row);
            }
          }
          this.table.refreshTable();
      });
    }else if(this.passData.selector == 'block'){
        this.passTable.tHeader = ['Region Code', 'Region Description', 'Province Code', 'Province Description', 'City Code', 'City Description', 'District Code', 'District Description', 'Block Code', 'Block Description' ];
        this.passTable.dataTypes = ['text', 'text', 'text', 'text', 'text', 'text', 'text','text','text','text'];
        this.passTable.keys = [
          'regionCd',
          'regionDesc',
          'provinceCd',
          'provinceDesc',
          'cityCd',
          'cityDesc',
          'districtCd',
          'districtDesc',
          'blockCd',
          'blockDesc'];
          this.mtnService.getMtnBlock(this.passData.regionCd,this.passData.provinceCd,this.passData.cityCd,this.passData.districtCd).subscribe((data: any) => {
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
                        let row:any = new Object();
                                 row.regionCd = data.region[a].regionCd;
                                 row.regionDesc = data.region[a].regionDesc;
                                 row.provinceCd = data.region[a].provinceList[b].provinceCd;
                                 row.provinceDesc = data.region[a].provinceList[b].provinceDesc;
                                 row.cityCd = data.region[a].provinceList[b].cityList[c].cityCd;
                                 row.cityDesc = data.region[a].provinceList[b].cityList[c].cityDesc;
                                 row.zoneCd = data.region[a].provinceList[b].cityList[c].zoneCd;
                                 row.zoneDesc = data.region[a].provinceList[b].cityList[c].zoneDesc;
                                 row.districtCd = data.region[a].provinceList[b].cityList[c].districtList[d].districtCd;
                                 row.districtDesc = data.region[a].provinceList[b].cityList[c].districtList[d].districtDesc;
                                 row.blockCd = data.region[a].provinceList[b].cityList[c].districtList[d].blockList[e].blockCd;
                                 row.blockDesc = data.region[a].provinceList[b].cityList[c].districtList[d].blockList[e].blockDesc;
                        this.passTable.tableData.push(row);
                    }
                  }
                }
              }
          }
                
            this.table.refreshTable();
          });
    }else if(this.passData.selector == 'otherRates'){
      this.passTable.tHeader = [ 'Cover Code','Cover Name','Section','Bullet No','Sum Insured'];
      this.passTable.dataTypes = [ 'number','text','select','text','currency','text'];
      this.passTable.keys = ['coverCd','coverCdAbbr','section','bulletNo','sumInsured']
      this.quotationService.getCoverageInfo(this.passData.quoteNo,null).subscribe((data: any) => {
        if(data.quotation.project !== null ){
          this.passTable.tableData = data.quotation.project.coverage.sectionCovers.filter((data)=>{return this.passData.hide.indexOf(data.coverCd)==-1});
        }
        this.table.refreshTable();
      })
    }

    this.modalOpen = true;
	}

}
