import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MaintenanceService, UnderwritingService, QuotationService, AccountingService, SecurityService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { Router } from '@angular/router';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LovComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild('lovTbl') table : CustNonDatatableComponent;
  @ViewChild(ModalComponent) modal : ModalComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  
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

  dialogIcon: string = '';
  dialogMessage: string = '';

  preventDefault: boolean = false;

  constructor(private modalService: NgbModal, private mtnService : MaintenanceService, private underwritingService: UnderwritingService,
    private quotationService: QuotationService, private router: Router, private accountingService: AccountingService, private securityService : SecurityService) { }

  ngOnInit() {
  	  // if(this.lovCheckBox){
     //    this.passTable.checkFlag = true;
     //  }
  }

  // pinaikli ko lang, pabalik sa dati pag may mali - YELE
  select(data){
    console.log(data);
    var index = 0;
    var ref = '';
    var processingCount = 0;
    if(Array.isArray(data)){
      for(var el of data){
        if(el.processing != null && el.processing != undefined){
          ref = el.processing;
          el.checked = false;
          this.table.selected[index].checked = false;
          processingCount = data.filter(a=>{return a.processing}).length;
          data = data.filter(a=>{return a.checked});
          this.table.selected = this.table.selected.filter(b=>{return b.checked});
          this.passTable.tableData[this.passTable.tableData.indexOf(el)].checked = false;
          this.dialogIcon = 'info';
          if(processingCount > 1){
            this.dialogMessage = 'Some of the items were not selected because they\'re currently being processed in another transactions.';
            this.passData.data = data.filter(a=>{return a.checked});
          }else if(this.passData.selector.indexOf('acitSoaDtl') == 0){
            this.dialogMessage = 'This policy installment is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ ref + ' first.';
            this.passData.data = data.filter(a=>{return a.checked});
          }else if(this.passData.selector.indexOf('clmResHistPayts') == 0 || this.passData.selector == 'acitArClmRecover'){
            this.dialogMessage = 'This claim history is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ ref + ' first.';
            this.passData.data = data.filter(a=>{return a.checked});
          }else if(this.passData.selector == 'paytReqList'){
            this.dialogMessage = 'This Payment Request is being processed for payment in another transaction. Please finalize the transaction with Check Voucher No. '+ ref + ' first.';
            this.passData.data = data.filter(a=>{return a.checked});
          }else if(this.passData.selector == 'acitInvt' || this.passData.selector == 'acitArInvPullout'){
            this.dialogMessage = 'This Investment (Placement) is being processed for payment in another transaction. Please finalize the transaction with Request No. '+ ref + ' first.';
            this.passData.data = data.filter(a=>{return a.checked});
          }else if(this.passData.selector == 'acitArInvPullout'){
            this.dialogMessage = 'This Investment is being processed for payment in another transaction. Please finalize the transaction with Request No. '+ ref + ' first.';
            this.passData.data = data.filter(a=>{return a.checked});
          }else{
            console.log(data);
            this.passData.data = data;
          }
          setTimeout(()=>{this.successDiag.open();this.table.refreshTable();},0)
          break;
        }else{
          console.log(data);
          this.passData.data = data;
        }
        index += 1;
      };
    }else{
      this.passData.data = data;
    };
  }
  // END YELE

  /*//eto orig ng inedit ko - YELE
  select(data){
    if(this.passData.selector.indexOf('acitSoaDtl') == 0){
      var index = 0;
      for(var i of data){
        if(i.processing !== null && i.processing !== undefined){
          this.dialogIcon = 'info';
          this.dialogMessage = 'This policy installment is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ i.processing+ ' first.';
          i.checked = false;
          this.table.selected[index].checked = false;
          data = data.filter(a=>{return a.checked});
          this.table.selected = this.table.selected.filter(b=>{return b.checked});
          this.passTable.tableData[this.passTable.tableData.indexOf(i)].checked = false;
          setTimeout(()=>{
            this.successDiag.open();
            this.table.refreshTable();
          },0)
          break;
        }else{
          this.passData.data = data.filter(a=>{return a.checked});
        }
        index += 1;
      }
    }else if(this.passData.selector.indexOf('clmResHistPayts') == 0 || this.passData.selector == 'acitArClmRecover'){
      var index = 0;
      for(var i of data){
        if(i.processing !== null && i.processing !== undefined){
          this.dialogIcon = 'info';
          this.dialogMessage = 'This claim history is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ i.processing+ ' first.';
          i.checked = false;
          this.table.selected[index].checked = false;
          data = data.filter(a=>{return a.checked});
          this.table.selected = this.table.selected.filter(b=>{return b.checked});
          this.passTable.tableData[this.passTable.tableData.indexOf(i)].checked = false;
          setTimeout(()=>{
            this.successDiag.open();
            this.table.refreshTable();
          },0)
          break;
        }else{
          this.passData.data = data.filter(a=>{return a.checked});
        }
        index += 1;
      }
    }else if(this.passData.selector == 'paytReqList'){
      var index = 0;
      for(var i of data){
        if(i.processing !== null && i.processing !== undefined){
          this.dialogIcon = 'info';
          this.dialogMessage = 'This payment request is being processed for payment in another transaction. Please finalize the transaction with CV No. '+ i.processing + ' first.';
          i.checked = false;
          this.table.selected[index].checked = false;
          data = data.filter(a=>{return a.checked});
          this.table.selected = this.table.selected.filter(b=>{return b.checked});
          this.passTable.tableData[this.passTable.tableData.indexOf(i)].checked = false;
          setTimeout(()=>{
            this.successDiag.open();
            this.table.refreshTable();
          },0)
          break;
        }else{
          this.passData.data = data.filter(a=>{return a.checked});
        }
        index += 1;
      }
    }else{
      this.passData.data = data;
    }//
  	// -- this.passData.data = data;
  }*/

  okBtnClick(){ 
    let selects:any[] = [];
    if(!this.lovCheckBox){
      this.selectedData.emit(this.passData);
      console.log(this.passData);
    }
    else{
      selects = this.passTable.tableData.filter(a=>a.checked);
      console.log(selects)
      this.passData.data = selects;
      this.selectedData.emit(this.passData);
    }

    this.passData.data = null;
  }

  checkCode(selector?,regionCd?, provinceCd?, cityCd?, districtCd?, blockCd?, ev?) {
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
      this.passData.params.activeTag = 'Y';
      this.mtnService.getMtnAcitChartAcct(this.passData.params).subscribe(a=>{
        this.passTable.tableData = a["list"].sort((a, b) => a.shortCode.localeCompare(b.shortCode)).map(e => {e.newRec=1; return e;});
        this.table.refreshTable();
        console.log(this.passTable.tableData);
      })
    }else if(this.passData.selector == 'slType'){
      this.passTable.tHeader = ['SL Type Code','SL Type Name'];
      this.passTable.widths =[250,500]
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'slTypeCd','slTypeName'];
      this.passData.params.activeTag = 'Y';
      this.mtnService.getMtnSlType(this.passData.params).subscribe(a=>{
        this.passTable.tableData = a["list"].sort((a, b) => a.slTypeCd - b.slTypeCd);
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'sl'){
      this.passTable.tHeader = ['SL Name'];
      this.passTable.widths =['auto']
      this.passTable.dataTypes = [ 'text'];
      this.passTable.keys = ['slName'];
      this.passData.params.activeTag = 'Y';
      this.mtnService.getMtnSL(this.passData.params).subscribe(a=>{
       this.passTable.tableData = a["list"].sort((a, b) => a.slName.localeCompare(b.slName));
       this.table.refreshTable();
       })

    }else if(this.passData.selector == 'acitSoaDtl'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
      this.passTable.widths =[300,300,1,200,200,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency', 'currency', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'netDue', 'totalPayments', 'prevBalance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtlJVOverdue'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
      this.passTable.widths =[300,300,1,200,200,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency', 'currency', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'netDue', 'totalPayments', 'prevBalance'];
      this.passTable.checkFlag = true;
      this.accountingService.getSoaOverdue(this.passData.policyId, this.passData.instNo, this.passData.cedingId,this.passData.currCd).subscribe((a:any)=>{
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtlOverdue'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
      this.passTable.widths =[300,300,1,200,200,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency', 'currency', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'netDue', 'totalPayments', 'prevBalance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaDtlAr'){
      this.passTable.tHeader = ['Memo No.', 'Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
      this.passTable.widths =[300,300,300,1,200,200,200,200]
      this.passTable.dataTypes = ['text', 'text', 'sequence-2', 'text', 'date', 'currency', 'currency', 'currency'];
      this.passTable.keys = ['memoNo', 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'netDue', 'totalPayments', 'prevBalance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1 && data.prevBalance !== 0});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        console.log(this.passTable.tableData);
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'ZeroBal'){
      this.passTable.tHeader = ['Memo No.', 'Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
      this.passTable.widths =[300, 300,300,1,200,200,200,200]
      this.passTable.dataTypes = ['text', 'text', 'sequence-2', 'text', 'date', 'currency', 'currency', 'currency'];
      this.passTable.keys = ['memoNo', 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'netDue', 'totalPayments', 'balance'];
      this.passTable.checkFlag = false;
      this.accountingService.getSoaDtlZero(this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.currCd).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'acitSoaTrtyDtl'){
      this.passTable.tHeader = ['Policy No.', 'Inst No.', 'Co Ref No', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
      this.passTable.widths =[300,300,1,200,200,200,200]
      this.passTable.dataTypes = [ 'text', 'sequence-2', 'text', 'date', 'currency', 'currency', 'currency'];
      this.passTable.keys = [ 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'netDue', 'totalPayments', 'balance'];
      this.passTable.checkFlag = true;
      this.accountingService.getAcitSoaTrtyDtl(this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any) => {
        this.passTable.tableData = a.soaDetails.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitSoaDtlPrq'){ //temporary
      this.passTable.tHeader    = ['Memo No.', 'Policy No.', 'Inst No.', 'Co Ref. No.', 'Due Date', 'Cumulative Payment', 'Balance'];
      this.passTable.widths     = [120,120,1,1,110,110,120];
      this.passTable.dataTypes  = ['text', 'text', 'sequence-2','text','date', 'currency', 'currency'];
      this.passTable.keys       = ['memoNo', 'policyNo', 'instNo', 'coRefNo', 'dueDate', 'totalPayments','prevBalance'];
      this.passTable.checkFlag  = true;
      this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal)
      .subscribe((a:any)=>{
        var rec = a["soaDtlList"].filter(e => e.payeeNo == this.passData.payeeNo).map(a => { a.returnAmt = a.paytAmt; return a; });
        this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}).map(e => { e.returnAmt = e.prevBalance; e.edited = true; e.validate = true; return e; });
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
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
        var rec = data["invtList"].filter(e => e.invtStatus == 'F' && e.currCd == this.passData.currCd && e.bank == this.passData.payeeNo);
        this.passTable.tableData = rec.filter((a)=> { return  this.passData.hide.indexOf(a.invtId)==-1 });
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitArClmRecover'){
      var histTypes = [7,8,9];
      this.passTable.tHeader = ['Claim No','Hist No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Cummulative Payment'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCategoryDesc', 'histTypeDesc', 'reserveAmt', 'cumulativeAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getClmResHistPayts(this.passData.cedingId,this.passData.payeeNo, this.passData.currCd).subscribe((data:any) => {
        console.log(data.clmpayments);
        this.passTable.tableData = data.clmpayments.filter((data)=> {return !this.passData.hide.includes(JSON.stringify({claimId: data.claimId, histNo: data.histNo})) && histTypes.includes(data.histType) && (data.reserveAmt - data.cumulativeAmt) !== 0});
        //this.passTable.tableData = data.clmpayments;
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitArInvPullout'){
      this.passTable.tHeader = ['Investment Code','Certificate No.', 'Investment', 'Investment Income', 'Bank Charge', 'Withholding Tax'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','text', 'currency', 'currency', 'currency', 'currency',];
      this.passTable.keys = [ 'invtCd','certNo', 'invtAmt', 'incomeAmt', 'bankCharge', 'whtaxAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getAccInvestments(this.passData.searchParams).subscribe((a:any)=>{
        //this.passTable.tableData = a["soaDtlList"];
        this.passTable.tableData = a.invtList.filter((data)=>{return  this.passData.hide.indexOf(data.invtCd)==-1});
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      })
    }else if(this.passData.selector == 'clmResHistPayts'){
      var clmStatus = ['TC', 'CD', 'DN', 'CP'];
      this.passTable.tHeader = ['Claim No','Hist No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Cummulative Payment'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCategoryDesc', 'histTypeDesc', 'reserveAmt', 'cumulativeAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getClmResHistPayts(this.passData.cedingId,this.passData.payeeNo, this.passData.currCd).subscribe((data:any) => {
        this.passTable.tableData = data.clmpayments.filter((data)=> { 
                                                                      return !this.passData.hide.includes(JSON.stringify({claimId: data.claimId, histNo: data.histNo})) && !clmStatus.includes(data.clmStatCd)});
        //this.passTable.tableData = data.clmpayments;
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'clmResHistPaytsOffset'){
      var histTypes = [4,5,7,8,9,10];
      var clmStatus = ['TC', 'CD', 'DN', 'CP'];
      this.passTable.tHeader = ['Claim No','Hist No.', 'Hist. Category', 'Hist. Type', 'Reserve', 'Cummulative Payment'];
      this.passTable.widths =[300,300,300,300,300,300]
      this.passTable.dataTypes = [ 'text','sequence-2', 'text', 'text', 'currency', 'currency',];
      this.passTable.keys = [ 'claimNo','histNo', 'histCategoryDesc', 'histTypeDesc', 'reserveAmt', 'cumulativeAmt'];
      this.passTable.checkFlag = true;
      this.accountingService.getClmResHistPayts(this.passData.cedingId,this.passData.payeeNo, this.passData.currCd).subscribe((data:any) => {
        this.passTable.tableData = data.clmpayments.filter((data)=> {return !this.passData.hide.includes(JSON.stringify({claimId: data.claimId, histNo: data.histNo})) && histTypes.includes(data.histType) && !clmStatus.includes(data.clmStatCd)});
        //this.passTable.tableData = data.clmpayments;
        for(var i of this.passTable.tableData){
          if(i.processing !== null && i.processing !== undefined){
            i.preventDefault = true;
          }
        }
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
      this.mtnService.getMtnBank('','','Y','Y').subscribe((a:any)=>{
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
    }else if(this.passData.selector == 'paytReqType'){
      this.passTable.tHeader = ['Description'];
      this.passTable.widths =['auto']
      this.passTable.dataTypes = ['text'];
      this.passTable.keys = ['description'];
      if(this.passData.from == 'acit'){
          this.passTable.keys = ['description'];
          this.mtnService.getRefCode('MTN_ACIT_TRAN_TYPE.GROUP_TAG').subscribe((a:any)=>{
          this.passTable.tableData = a.refCodeList.filter(e => e.code == 'C' || e.code == 'P' || e.code == 'S' || e.code == 'Q' || e.code == 'I' || e.code == 'O');
          this.passTable.tableData.push({code: "O", identifier: "MTN_ACIT_TRAN_TYPE.GROUP_TAG", description: "Others"})
          this.table.refreshTable();
        });
      }else if(this.passData.from == 'acse'){
        this.passTable.keys = ['tranTypeName'];
        this.mtnService.getMtnAcseTranType('PRQ','','','','','Y')
        .subscribe(data => {
          this.passTable.tableData = data['tranTypeList'];
          this.table.refreshTable();
        });
      }
    }else if(this.passData.selector == 'paytReqList'){
      this.passTable.tHeader = ['Payment Request No.','Payment Type','Request Date','Particulars','Requested By','Curr','Amount'];
      this.passTable.widths = [120,150,1,120,100,1,120];
      this.passTable.dataTypes = [ 'text','text','date','text','text','text','currency'];
      this.passTable.keys = ['paytReqNo','tranTypeDesc','reqDate','particulars','requestedBy','currCd','reqAmt'];
      this.passTable.checkFlag = true;
      if(this.passData.from == 'acit'){
        this.accountingService.getPaytReqList([]).subscribe((a:any)=>{
          var rec = a['acitPaytReq'].filter(e => e.payeeCd == this.passData.payeeCd && e.currCd == this.passData.currCd && e.reqStatus == 'A' && e.paytReqType == this.passData.paytReqType);
          this.passTable.tableData = rec.filter((data)=>{return  this.passData.hide.indexOf(data.reqId)==-1});
          for(var i of this.passTable.tableData){
            if(i.processing !== null && i.processing !== undefined){
              i.preventDefault = true;
            }
          }
          this.table.refreshTable();
        });
      }else if(this.passData.from == 'acse'){
        this.accountingService.getAcsePaytReqList([]).subscribe((a:any) => {
          var rec = a['acsePaytReq'].filter(e => e.payeeCd == this.passData.payeeCd && e.currCd == this.passData.currCd && e.reqStatus == 'A' && e.paytReqType == Number(this.passData.paytReqType));
          this.passTable.tableData = rec.filter((data)=>{return  this.passData.hide.indexOf(data.reqId)==-1});
          for(var i of this.passTable.tableData){
            if(i.processing !== null && i.processing !== undefined){
              i.preventDefault = true;
            }
          }
          this.table.refreshTable();
        });
      }
      
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
        this.passTable.tableData = a.bankAcctList.filter(e => e.currCd == this.passData.currCd && e.acItGlDepNo != null);
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
    }else if(this.passData.selector == 'mtnGenTax'){
      this.passTable.tHeader = ['Tax Code', 'Description', 'Rate', 'Amount'];
      this.passTable.widths = [77,'auto', 77,100]
      this.passTable.dataTypes = [ 'text','text', 'percent', 'currency'];
      this.passTable.keys = [ 'taxCd','taxName', 'taxRate', 'amount'];
      this.passTable.checkFlag = true;
      this.mtnService.getMtnGenTax(this.passData.taxCd, this.passData.taxName, this.passData.chargeType, this.passData.fixedTag, this.passData.activeTag).subscribe((a:any)=>{
        //this.passTable.tableData = a["genTaxList"];
        this.passTable.tableData = a.genTaxList.filter((data)=>{return  this.passData.hide.indexOf(data.taxCd)==-1});
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'mtnWhTax'){
      this.passTable.tHeader = ['Tax Code', 'Description', 'Rate', 'Amount'];
      this.passTable.widths = [77,'auto', 77,100]
      this.passTable.dataTypes = [ 'text','text', 'percent', 'currency'];
      this.passTable.keys = [ 'taxCd','taxName', 'taxRate', 'amount'];
      this.passTable.checkFlag = true;
      this.mtnService.getMtnWhTax(this.passData.taxCd, this.passData.taxName, this.passData.taxType, this.passData.creditableTag, this.passData.fixedTag, this.passData.activeTag).subscribe((a:any)=>{
        //this.passTable.tableData = a["whTaxList"];
        this.passTable.tableData = a.whTaxList.filter((data)=>{return  this.passData.hide.indexOf(data.taxCd)==-1});
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'arList'){
      this.passTable.tHeader = ['A.R. No.','Payor','AR Date','Payment Type','Status','Particulars','Amount'];
      this.passTable.widths = [25, 80, 40, 100,80, 200, 125];
      this.passTable.dataTypes = ['sequence-6','text','date','text','text','text','currency'];
      this.passTable.keys = ['arNo', 'payor', 'arDate', 'tranTypeName', 'arStatDesc', 'particulars', 'arAmt'];
      this.passTable.checkFlag = false;
      this.accountingService.getArList(this.passData.searchParams).subscribe((a:any)=>{
        this.passTable.tableData = a["ar"];
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitJvList'){
      this.passTable.tHeader = ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Status", "Prepared By","Amount"];
      this.passTable.widths = [120,98,171,335,110,115];
      this.passTable.dataTypes = ['text','date','text','text','text','currency',];
      this.passTable.keys = ['jvNo','jvDate','particulars','tranTypeName','jvStatusName','jvAmt'];
      this.passTable.checkFlag = false;
      this.accountingService.getJVListing(null).subscribe((data:any)=>{
        for(var i=0; i< data.transactions.length;i++){
                this.passTable.tableData.push(data.transactions[i].jvListings);
                this.passTable.tableData[this.passTable.tableData.length - 1].jvNo = String(data.transactions[i].jvListings.jvYear) + '-' +  String(data.transactions[i].jvListings.jvNo);
                this.passTable.tableData[this.passTable.tableData.length - 1].transactions = data.transactions[i];
              }

              this.passTable.tableData.forEach(a => {
                if(a.transactions.tranStat != 'O' && a.transactions.tranStat != 'C') {
                  a.jvStatus = a.transactions.tranStat;
                  a.jvStatusName = a.transactions.tranStatDesc;
                }
              });
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acitCvList'){
      this.passTable.tHeader = ["CV No", "Payee", "Payment Request No", "CV Date", "Status","Particulars","Amount"];
      this.passTable.dataTypes = ['text','text','text','date','text','text','currency',];
      this.passTable.keys = ['cvGenNo','payee','refNo','cvDate','cvStatusDesc','particulars','cvAmt'];
      this.passTable.checkFlag = false;
      this.accountingService.getAcitCvList(this.passData.searchParams).subscribe((data:any)=>{
        var rec = data['acitCvList'].map(i => { 
                /*i.createDate     = this.ns.toDateTimeString(i.createDate); 
                i.updateDate     = this.ns.toDateTimeString(i.updateDate);
                i.checkDate      = this.ns.toDateTimeString(i.checkDate);
                i.preparedDate   = this.ns.toDateTimeString(i.preparedDate);
                i.certifiedDate  = this.ns.toDateTimeString(i.certifiedDate);*/

                if(i.mainTranStat != 'O' && i.mainTranStat != 'C') {
                  i.cvStatus = i.mainTranStat;
                  i.cvStatusDesc = i.mainTranStatDesc;
                }

                return i; 
              });
        this.passTable.tableData = rec;
        this.table.refreshTable();
      });
    }else if(this.passData.selector == 'acseChartAcct'){
      this.passTable.tHeader = ['Account Code','Account Name'];
      this.passTable.widths =[250,500]
      this.passTable.dataTypes = [ 'text','text'];
      this.passTable.keys = [ 'shortCode','shortDesc'];
      this.passData.params.activeTag = 'Y';
      this.mtnService.getMtnAcseChartAcct(this.passData.params).subscribe(a=>{
        this.passTable.tableData = a["list"].sort((a, b) => a.shortCode.localeCompare(b.shortCode)).map(e => {e.newRec=1; return e;});
        this.table.refreshTable();
        console.log(this.passTable.tableData);
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
