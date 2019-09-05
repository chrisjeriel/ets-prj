import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MaintenanceService, UnderwritingService, QuotationService, AccountingService, SecurityService } from '@app/_services';
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
  @ViewChild('lovTbl') table : CustNonDatatableComponent;
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

  //yele
  @Input() limitContent : any[] = [];
  //end

  modalOpen: boolean = false;

  @Input() set lovCheckBox(val:boolean){
    this.passTable.checkFlag = val;
  }
  showButton: boolean = false;
  theme =  window.localStorage.getItem("selectedTheme");

  constructor(private modalService: NgbModal, private mtnService : MaintenanceService, private underwritingService: UnderwritingService,
    private quotationService: QuotationService, private router: Router, private accountingService: AccountingService, private securityService : SecurityService) { }

  ngOnInit() {
  	  // if(this.lovCheckBox){
     //    this.passTable.checkFlag = true;
     //  }
     console.log(this.lovCheckBox)
  }

  select(data){
    console.log(this.passTable.checkFlag);
    console.log(this.passData.data);
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

    this.passData.data = null;
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
        console.log(data);
        for (var a = 0; a < data.region.length; a++) {
          if (data.region[a].activeTag === 'Y'){
            let row : any = new Object();
                row.regionCd = data.region[a].regionCd;
                row.regionDesc = data.region[a].regionDesc;
                row.remarks = data.region[a].remarks;
                this.passTable.tableData.push(row);
          } 
        }
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
    }else if(this.passData.selector == 'acitChartAcct'){
      this.passTable.tHeader = ['Account Code','Account Name'];
      this.passTable.widths =[250,500]
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'shortCode','shortDesc'];
      this.mtnService.getMtnAcitChartAcct(this.passData.params).subscribe(a=>{
        this.passTable.tableData = a["list"];
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'slType'){
      this.passTable.tHeader = ['SL Type Code','SL Type Name'];
      this.passTable.widths =[250,500]
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'slTypeCd','slTypeName'];
      this.mtnService.getMtnSlType(this.passData.params).subscribe(a=>{
        this.passTable.tableData = a["list"];
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'sl'){
      this.passTable.tHeader = ['SL Name'];
      this.passTable.widths =['auto']
      this.passTable.dataTypes = [ 'text'];
      this.passTable.keys = [ 'slName'];
      this.mtnService.getMtnSL(this.passData.params).subscribe(a=>{
       this.passTable.tableData = a["list"];
       this.table.refreshTable();
       })

    }else if(this.passData.selector == 'acitSoaDtl'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Balance'];
      this.passTable.widths =[300,300,1,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'balance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        console.log(this.passTable.tableData);
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtlOverdue'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Balance'];
      this.passTable.widths =[300,300,1,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'balance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        console.log(this.passTable.tableData);
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtlAr'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Balance'];
      this.passTable.widths =[300,300,1,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'balance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        console.log(this.passTable.tableData);
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtlZeroBal'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Balance'];
      this.passTable.widths =[300,300,1,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'balance'];
      this.passTable.checkFlag = false;
      console.log(this.passData)
      this.accountingService.getSoaDtlZero(this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.currCd).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaTrtyDtl'){
      this.passTable.tHeader = ['SOA No.','Policy No.', 'Inst No.', 'Due Date', 'Balance'];
      this.passTable.widths =[300,300,1,200,200]
      this.passTable.dataTypes = [ 'text','text', 'sequence-2', 'date', 'currency'];
      this.passTable.keys = [ 'soaNo','policyNo', 'instNo', 'dueDate', 'balance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaTrtyDtl(this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any) => {
        this.passTable.tableData = a.soaDetails.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitSoaDtlPrq'){ //temporary
      this.passTable.tHeader    = ['Policy No.', 'Inst No.', 'Co Ref. No.', 'Due Date', 'Cumulative Payment', 'Balance'];
      this.passTable.widths     = [120,1,1,110,110,120];
      this.passTable.dataTypes  = ['text', 'sequence-2','text','date', 'currency', 'currency'];
      this.passTable.keys       = ['policyNo', 'instNo', 'coRefNo', 'dueDate', 'cumPayment','balance'];
      this.passTable.checkFlag  = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal)
      .subscribe((a:any)=>{
         // (Number(e.totalPayments) + Number(e.tempPayments)) > 0
        var rec = a["soaDtlList"].filter(e => e.payeeNo == this.passData.payeeNo).map(a => { a.returnAmt = a.paytAmt; return a; });//.map(e => { e.newRec = 1; e.prevPaytAmt = (Number(e.totalPayments) + Number(e.tempPayments)); return e; });
        if(this.limitContent.length != 0) {
          var limit = this.limitContent.filter(a => a.showMG != 1).map(a => JSON.stringify({policyId: a.policyId, instNo: a.instNo}));
          this.passTable.tableData =    rec.filter(a => {
                             var mdl = JSON.stringify({policyId: a.policyId, instNo: a.instNo});
                             return !limit.includes(mdl);
                           });
        } else {
          this.passTable.tableData = rec;
        }

        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitInvt'){
      this.passTable.tHeader    = ['Investment Code', 'Investment Type', 'Security', 'Maturity Period', 'Duration Unit', 'Interest Rate', 'Date Purchased', 'Maturity Date', 'Curr', 'Curr Rate', 'Investment'];
      this.passTable.widths     = [150,200,150,1,1,120,1,1,1,120,150];
      this.passTable.dataTypes  = ['text','text','text','number','text','percent','date','date','text','percent','currency'];
      this.passTable.keys       = ['invtCd','invtTypeDesc','securityDesc','matPeriod','durUnit','intRt','purDate','matDate','currCd','currRate','invtAmt'];
      this.passTable.checkFlag  = true;
      this.accountingService.getAccInvestments([])
      .subscribe((data:any)=>{
        var rec = data["invtList"].filter(e => e.invtStatus == 'F');
        console.log(this.limitContent);
        if(this.limitContent.length != 0){
          var limit = this.limitContent.filter(a => a.showMG != 1).map(a => JSON.stringify({invtId: a.invtId}));
          this.passTable.tableData =    rec.filter(a => {
                             var mdl = JSON.stringify({invtId: a.invtId});
                             return !limit.includes(mdl);
                           }).map(x => { x.newRec = 1; x.currAmt = x.invtAmt; return x; });
        }
        console.log(this.passTable.tableData);
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitArClmRecover'){
      /*this.passTable.tHeader = ['Claim No.','Co. Claim No.', 'Policy No.', 'Loss Date'];
      this.passTable.widths =[300,300,300,150]
      this.passTable.dataTypes = [ 'text','text', 'text', 'date'];
      this.passTable.keys = [ 'claimNo','coClmNo', 'policyNo', 'lossDate'];
      this.passTable.checkFlag = true;*/
      this.passTable.tHeader = ['Claim No.','Hist. No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Paid Amount'];
      this.passTable.widths =[250,100,200,250,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCategoryDesc', 'histTypeDesc', 'reserveAmt', 'cumulativeAmt'];
      this.passTable.checkFlag = true;
      /*this.accountingService.getAcitArClmRecoverLov(this.passData.payeeNo, this.passData.currCd).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.claimList.filter((data)=>{return  this.passData.hide.indexOf(data.claimId)==-1});
        this.table.refreshTable();
      })*/
      this.accountingService.getClmResHistPayts(null,this.passData.payeeNo, this.passData.currCd).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.clmpayments.filter((data)=>{return  this.passData.hide.indexOf(data.claimId)==-1 && (data.histType === 7 || data.histType === 8)});
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitArInvPullout'){
      this.passTable.tHeader = ['Investment Code','Certificate No.', 'Investment', 'Investment Income', 'Bank Charge', 'Withholding Tax'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','text', 'currency', 'currency', 'currency', 'currency',];
      this.passTable.keys = [ 'invtCd','certNo', 'invtAmt', 'incomeAmt', 'bankCharge', 'whtaxAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getAccInvestments(this.passData.searchParams).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.invtList.filter((data)=>{return  this.passData.hide.indexOf(data.invtCd)==-1});
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'clmResHistPayts'){
      this.passTable.tHeader = ['Claim No','Hist No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Cummulative Payment'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCategoryDesc', 'histTypeDesc', 'reserveAmt', 'cumulativeAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getClmResHistPayts(this.passData.cedingId,this.passData.payeeNo, this.passData.currCd).subscribe((data:any) => {
        this.passTable.tableData = data.clmpayments.filter((data)=> {return this.passData.hide.indexOf(data.claimNo)==-1});
        //this.passTable.tableData = data.clmpayments;
        console.log(data.clmpayments);
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'clmResHistPaytsOffset'){
      var histTypes = [4,5,7,8,9,10];
      this.passTable.tHeader = ['Claim No','Hist No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Cummulative Payment'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCategoryDesc', 'histTypeDesc', 'reserveAmt', 'cumulativeAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getClmResHistPayts(this.passData.cedingId,this.passData.payeeNo, this.passData.currCd).subscribe((data:any) => {
        this.passTable.tableData = data.clmpayments.filter((data)=> {return histTypes.includes(data.histType)});
        //this.passTable.tableData = data.clmpayments;
        console.log(data.clmpayments);
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitArClmCashCall'){
      this.passTable.tHeader = ['Claim No.','Co. Claim No.', 'Policy No.', 'Loss Date'];
      this.passTable.widths =[300,300,300,150]
      this.passTable.dataTypes = [ 'text','text', 'text', 'date'];
      this.passTable.keys = [ 'claimNo','coClmNo', 'policyNo', 'lossDate'];
      this.passTable.checkFlag = true;
      /*this.passTable.tHeader = ['Claim No.','Hist. No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Paid Amount'];
      this.passTable.widths =[250,100,200,250,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCatDesc', 'histTypeDesc', 'reserveAmt', 'paytAmt'];
      this.passTable.checkFlag = true;*/
      this.accountingService.getAcitArClmCashCallLov(this.passData.payeeNo, this.passData.currCd).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.clmCashCallLovList.filter((data)=>{return  this.passData.hide.indexOf(data.claimId)==-1 });
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'mtnBank'){
      this.passTable.tHeader = ['Bank', 'Official Name'];
      this.passTable.widths =['100','auto']
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'shortName','officialName']; 
      this.mtnService.getMtnBank().subscribe((a:any)=>{
        this.passTable.tableData = a.bankList;
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'checkClass'){
      this.passTable.tHeader = ['Code', 'Description'];
      this.passTable.widths =['100','auto']
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'code','description'];
      this.mtnService.getRefCode('CHECK_CLASS').subscribe((a:any)=>{
        this.passTable.tableData = a.refCodeList;
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'paytReqList'){
      this.passTable.tHeader = ['Payment Request No.','Payment Type','Request Date','Particulars','Requested By','Curr','Amount'];
      this.passTable.widths = [120,150,1,120,100,1,120];
      this.passTable.dataTypes = [ 'text','text','date','text','text','text','currency'];
      this.passTable.keys = ['paytReqNo','tranTypeDesc','reqDate','particulars','requestedBy','currCd','reqAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getPaytReqList([]).subscribe((a:any)=>{
        var rec = a['acitPaytReq'].filter(e => e.payeeCd == this.passData.payeeCd && e.currCd == this.passData.currCd && e.reqStatus == 'A');
        console.log(rec);
        if(this.limitContent.length != 0){
          var limit = this.limitContent.filter(a => a.showMG != 1).map(a => JSON.stringify({reqId: a.reqId}));
          this.passTable.tableData =  rec.filter(a => {
                             var mdl = JSON.stringify({reqId: a.reqId});
                             console.log(mdl);
                             return !limit.includes(mdl);
                           });
        }
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'mtnBussType'){
      this.passTable.tHeader = ['Business Type'];
      this.passTable.widths = ['auto']
      this.passTable.dataTypes = [ 'text'];
      this.passTable.keys = [ 'bussTypeName'];
      this.passTable.checkFlag = false;
      this.mtnService.getMtnBussType(this.passData.bussTypeCd, this.passData.bussTypeName, this.passData.activeTag).subscribe((a:any)=>{
        this.passTable.tableData = a["bussTypeList"];
        //this.passTable.tableData = a.bussTypeList.filter((data)=>{return  this.passData.hide.indexOf(data.bussTypeCd)==-1});
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'bankAcct'){
      this.passTable.tHeader = ['Account Name', 'Account No.'];
      this.passTable.widths =['100','auto']
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'accountName','accountNo'];
      this.mtnService.getMtnBankAcct(this.passData.bankCd).subscribe((a:any)=>{
        this.passTable.tableData = a.bankAcctList;
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'mtnBussType'){
      this.passTable.tHeader = ['Business Type'];
      this.passTable.widths = ['auto']
      this.passTable.dataTypes = [ 'text'];
      this.passTable.keys = [ 'bussTypeName'];
      this.passTable.checkFlag = false;
      this.mtnService.getMtnBussType(this.passData.bussTypeCd, this.passData.bussTypeName, this.passData.activeTag).subscribe((a:any)=>{
        this.passTable.tableData = a["bussTypeList"];
        //this.passTable.tableData = a.bussTypeList.filter((data)=>{return  this.passData.hide.indexOf(data.bussTypeCd)==-1});
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'mtnTransactions'){
      this.passTable.tHeader = ['Tran Code', 'Description'];
      this.passTable.widths = [77,'auto']
      this.passTable.dataTypes = [ 'number','text'];
      this.passTable.keys = [ 'tranCd','tranDesc'];
      this.passTable.checkFlag = false;
      this.securityService.getMtnTransactions(this.passData.moduleId, this.passData.tranCd).subscribe((a:any)=>{
        this.passTable.tableData = a["transactions"];
        //this.passTable.tableData = a.bussTypeList.filter((data)=>{return  this.passData.hide.indexOf(data.bussTypeCd)==-1});
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'mtnModules'){
      this.passTable.tHeader = ['Module ID', 'Description'];
      this.passTable.widths = [77,'auto']
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'moduleId','moduleDesc'];
      this.passTable.checkFlag = false;
      this.securityService.getMtnModules(this.passData.moduleId, this.passData.tranCd).subscribe((a:any)=>{
        this.passTable.tableData = a["modules"];
        //this.passTable.tableData = a.bussTypeList.filter((data)=>{return  this.passData.hide.indexOf(data.bussTypeCd)==-1});
        this.table.refreshTable();
      });
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
