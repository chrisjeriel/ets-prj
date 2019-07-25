import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MaintenanceService, UnderwritingService, QuotationService, AccountingService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { Router } from '@angular/router';



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

  @Input() set lovCheckBox(val:boolean){
    this.passTable.checkFlag = val;
  }
  showButton: boolean = false;
  theme =  window.localStorage.getItem("selectedTheme");

  constructor(private modalService: NgbModal, private mtnService : MaintenanceService, private underwritingService: UnderwritingService,
    private quotationService: QuotationService, private router: Router, private accountingService: AccountingService) { }

  ngOnInit() {
  	  // if(this.lovCheckBox){
     //    this.passTable.checkFlag = true;
     //  }
  }

  select(data){
  	  this.passData.data = data;
  }

  okBtnClick(){
    let selects:any[] = [];
    if(!this.lovCheckBox){
      this.selectedData.emit(this.passData);
    }
    else{
      selects = this.passTable.tableData.filter(a=>a.checked);
      this.passData.data = selects;
      this.selectedData.emit(this.passData);
    }
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
        this.mtnService.getMtnDistrict(regionCd, provinceCd, cityCd, districtCd, 'Y').subscribe((data: any) => {
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
    } else if (selector == 'userGrp'){
      if (this.passData.userGrp == '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnUserGrp(this.passData.userGrp).subscribe((data: any) => {
            if(data.userGroups.length > 0) {
              data['userGroups'][0].ev = ev;
              this.selectedData.emit({
                  data : data['userGroups'][0],
                  ev: ev
                }
                );
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });
              $('#lovMdl > #modalBtn').trigger('click');
            }
        });
      }
    }else if (selector == 'approvalCd'){
      if (this.passData.userGrp == '') {
        this.selectedData.emit({
          data: null,
          ev: ev
        });
      } else {
        this.mtnService.getMtnApprovalLOV(this.passData.approvalCd).subscribe((data: any) => {
            data.approvalFunction = data.approvalFunction.filter(a=>this.passData.hide.indexOf(a.approvalCd)==-1);
            if(data.approvalFunction.length > 0) {
              data['approvalFunction'][0].ev = ev;
              this.selectedData.emit({
                  data : data['approvalFunction'][0],
                  ev: ev
                }
                );
            } else {
              this.selectedData.emit({
                data: null,
                ev: ev
              });
              this.modal.openNoClose();
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

  checkCdOthers(selector,ev){
    if (selector == 'refNo'){

          this.passData.refNo = ev.target.value;
          if(this.passData.refNo == '') {
            this.selectedData.emit({
              selector: selector,
              data: null,
              ev: ev
            });
          } else {
            this.accountingService.getRefNoLov(this.passData.params).subscribe((data: any) => {
                let filtered:any[] = data.refNoList.filter(a=>a.tranNo==this.passData.refNo)
                if(filtered.length > 0) {
                  filtered[0].ev = ev;
                  this.selectedData.emit({
                      selector: selector,
                      data : filtered[0],
                      ev: ev
                    }
                    );
                } else {
                  this.selectedData.emit({
                    selector: selector,
                    data: null,
                    ev: ev
                  });
                  this.passData.selector = 'refNo';
                  this.modal.openNoClose();
                }
            });
          }
        }
  }

  openModal(){
    this.showButton = false;
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
               if (data.region[regionCount].provinceList[provinceCount].cityList[cityCount].activeTag === 'Y'){
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
      this.mtnService.getMtnDistrict(this.passData.regionCd,this.passData.provinceCd,this.passData.cityCd,undefined, 'Y').subscribe((data: any) => {
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
      this.passTable.keys = ['deductibleCd','deductibleTitle','typeDesc','deductibleRate','deductibleAmt','deductibleText'];
      this.underwritingService.getMaintenanceDeductibles(this.passData.lineCd,
        this.passData.params.deductibleCd,this.passData.params.coverCd,this.passData.params.endtCd,this.passData.params.activeTag,
        this.passData.params.defaultTag
        ).subscribe((data: any) => {
          console.log(this.passData.hide);
          this.passTable.tableData = data.deductibles.filter((data)=>{return  this.passData.hide.indexOf(data.deductibleCd)==-1});
          if(this.passData.endtCd !== undefined){
            this.passTable.tableData = this.passTable.tableData.filter(data=> data.endtCd==this.passData.endtCd || data.endtCd == 0  )
          }
          this.showButton = true;
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
              if (data.region[a].provinceList[b].activeTag === 'Y'){
                let row : any = new Object();
                row.regionCd = data.region[a].regionCd;
                row.regionDesc = data.region[a].regionDesc;
                row.provinceCd = data.region[a].provinceList[b].provinceCd;
                row.provinceDesc = data.region[a].provinceList[b].provinceDesc;
                row.remarks = data.region[a].provinceList[b].remarks;
                this.passTable.tableData.push(row);
              }
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
    }else if(this.passData.selector == 'otherCharges'){
      this.passTable.tHeader = [ 'Charge Code','Charge Name','Remarks','Amount'];
      this.passTable.dataTypes = [ 'sequence-3','text','text','currency'];
      this.passTable.keys = ['chargeCd','chargeDesc','remarks','defaultAmt']
      this.mtnService.getMtnOtherCharges().subscribe((data:any)=>{
        this.passTable.tableData = data.mtnChargesList.filter((data)=>{return this.passData.hide.indexOf(data.chargeCd)==-1});
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'polWordings'){
      this.passTable.tHeader = [ 'Wording Code','Wording Title','Text'];
      this.passTable.dataTypes = [ 'text','text','text'];
      this.passTable.keys = ['wordingCd','wordingTitle','text']
      this.mtnService.getMtnPolWordings(this.passData.params).subscribe((data:any)=>{
        for(let a of data.mtnPolWordings){
            a.text = '';
            a.text += a.wordText01 == null? '' : a.wordText01;
            a.text += a.wordText02 == null? '' : a.wordText02;
            a.text += a.wordText03 == null? '' : a.wordText03;
            a.text += a.wordText04 == null? '' : a.wordText04;
            a.text += a.wordText05 == null? '' : a.wordText05;
            a.text += a.wordText06 == null? '' : a.wordText06;
            a.text += a.wordText07 == null? '' : a.wordText07;
            a.text += a.wordText08 == null? '' : a.wordText08;
            a.text += a.wordText09 == null? '' : a.wordText09;
            a.text += a.wordText10 == null? '' : a.wordText10;
            a.text += a.wordText11 == null? '' : a.wordText11;
            a.text += a.wordText12 == null? '' : a.wordText12;
            a.text += a.wordText13 == null? '' : a.wordText13;
            a.text += a.wordText14 == null? '' : a.wordText14;
            a.text += a.wordText15 == null? '' : a.wordText15;
            a.text += a.wordText16 == null? '' : a.wordText16;
            a.text += a.wordText17 == null? '' : a.wordText17;
        }
        this.passTable.tableData = data.mtnPolWordings;
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'polWordingsAlt'){
      this.passTable.tHeader = [ 'Wording Code','Wording Title','Text'];
      this.passTable.dataTypes = [ 'text','text','text'];
      this.passTable.keys = ['wordingCd','wordingTitle','text']
      this.mtnService.getMtnPolWordings(this.passData.params).subscribe((data:any)=>{
        for(let a of data.mtnPolWordings){
            a.text = '';
            a.text += a.wordText01 == null? '' : a.wordText01;
            a.text += a.wordText02 == null? '' : a.wordText02;
            a.text += a.wordText03 == null? '' : a.wordText03;
            a.text += a.wordText04 == null? '' : a.wordText04;
            a.text += a.wordText05 == null? '' : a.wordText05;
            a.text += a.wordText06 == null? '' : a.wordText06;
            a.text += a.wordText07 == null? '' : a.wordText07;
            a.text += a.wordText08 == null? '' : a.wordText08;
            a.text += a.wordText09 == null? '' : a.wordText09;
            a.text += a.wordText10 == null? '' : a.wordText10;
            a.text += a.wordText11 == null? '' : a.wordText11;
            a.text += a.wordText12 == null? '' : a.wordText12;
            a.text += a.wordText13 == null? '' : a.wordText13;
            a.text += a.wordText14 == null? '' : a.wordText14;
            a.text += a.wordText15 == null? '' : a.wordText15;
            a.text += a.wordText16 == null? '' : a.wordText16;
            a.text += a.wordText17 == null? '' : a.wordText17;
        }
        this.passTable.tableData = data.mtnPolWordings;
        this.table.refreshTable();
      })
    }else if (this.passData.selector == 'userGrp'){
      this.passTable.tHeader = [ 'User Group','Description','Remarks'];
      this.passTable.dataTypes = [ 'number','text','text'];
      this.passTable.keys = ['userGrp','userGrpDesc','remarks'];
      this.mtnService.getMtnUserGrp().subscribe(a=>{
        this.passTable.tableData = a["userGroups"];
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'approvalFn'){
      this.passTable.tHeader = ['Approval Fn Code','Description', 'Remarks'];
      this.passTable.dataTypes = [ 'text','text','text'];
      this.passTable.keys = ['approvalCd','description','remarks'];
      this.mtnService.getMtnApprovalLOV().subscribe(a=>{
        this.passTable.tableData = a["approvalFunction"].filter(a=>this.passData.hide.indexOf(a.approvalCd)==-1);
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'refNo'){
      this.passTable.tHeader = ['Tran Class','Tran No.', 'Tran Type','Tran Date','Particulars','Amount'];
      this.passTable.dataTypes = [ 'text','text','text','date','text','currency'];
      this.passTable.keys = [ 'tranClass','tranNo','tranTypeName','tranDate','particulars','amount'];
      this.accountingService.getRefNoLov(this.passData.params).subscribe(a=>{
        this.passTable.tableData = a["refNoList"];
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'payee'){
      this.passTable.tHeader = ['Payee Name','Payee Class'];
      this.passTable.widths =[500,500]
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'payeeName','payeeClassName'];
      this.mtnService.getMtnPayee(this.passData.payeeNo, this.passData.payeeClassCd).subscribe(a=>{
        this.passTable.tableData = a["payeeList"];
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtl'){
      this.passTable.tHeader = ['SOA No.','Policy No.', 'Inst No.', 'Due Date', 'Balance'];
      this.passTable.widths =[300,300,1,200,200]
      this.passTable.dataTypes = [ 'text','text', 'sequence-2', 'date', 'currency'];
      this.passTable.keys = [ 'soaNo','policyNo', 'instNo', 'dueDate', 'balance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtl(this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        this.table.refreshTable();
      })
    }

    this.modalOpen = true;
	}


  maintainDeductibles(){
    this.router.navigate(['/maintenance-deductible', { info: 'new'}], {skipLocationChange: false});
    this.modalService.dismissAll();
  }

  openLOV(){
    this.modal.openNoClose();
  }
}
