import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any = {
  	createUser : '',
  	createDate : '',
  	updateUser : '',
  	updateDate : '',
  }
  passTable:any={
  	tableData:[],
  	widths:[1,'auto',1,'auto'],
  	tHeader:['Block Code','Description','Active','Remarks'],
  	dataTypes:['text','text','checkbox','text'],
  	keys:['blockCd','blockDesc','activeTag','remarks'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	nData:{
  	  districtCd:'',
  	  districtDesc:'',
      activeTag: "Y",
      remarks: '',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	}
  }
  cancelFlag:boolean;

  constructor(private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	setTimeout(a=>this.table.refreshTable(),0)
  }

  getBlock(){
  	this.table.loadingFlag = true;
  	this.ms.getMtnBlock(this.locData.regionCd,this.locData.provinceCd,this.locData.cityCd,this.locData.districtCd).subscribe(a=>{
  		if(a['region'].length != 0){
  			this.passTable.tableData = a['region'][0]['provinceList'][0]['cityList'][0]['districtList'][0]['blockList'];
  			  		this.passTable.tableData.forEach(a=>{
  			  			a.uneditable=['blockCd'];
  			  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  			})
	  	}
  		this.table.refreshTable();
  	})
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'You are not allowed to delete a Block that is already used in quotation processing.';
  		this.successDialog.open();
  	}else{
  		this.table.indvSelect.deleted = true;
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
  	}
  }

  save(can?){
  	this.cancelFlag = can !== undefined;
  	let params: any = {
  		regionCd : this.locData.regionCd,
  		provinceCd : this.locData.provinceCd,
  		cityCd : this.locData.cityCd,
  		districtCd: this.locData.districtCd,
  		saveBlock:[],
  		delBlock:[]
  	}
  	params.saveBlock = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
  	params.saveBlock.forEach(a=>a.updateUser = this.ns.getCurrentUser());
  	params.delBlock = this.passTable.tableData.filter(a=>a.deleted);
  	this.ms.saveMtnBlock(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getBlock();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSave(){
  	let blockCds:string[] = this.passTable.tableData.map(a=>a.blockCd);
  	if(blockCds.some((a,i)=>blockCds.indexOf(a)!=i)){
  		this.dialogMessage = 'Unable to save the record. Block Code must be unique per Region, Province, City and District.';
  		this.dialogIcon = 'error-message';
  		this.successDialog.open();
  		return;
  	}
  	this.conSave.confirmModal();
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

// --------------location stuff----------------------------------------------
  @ViewChild(LovComponent) lovMdl: LovComponent;
  passLOV: any = {};
  locData:any = {};
  oldValue: any;

  showCityModal(){
      $('#cityModal #modalBtn').trigger('click');
  }

  showDistrictModal() {
      $('#districtModal #modalBtn').trigger('click');
  }

  setDistrict(data){
      this.locData.districtCd = data.districtCd;
      this.locData.districtDesc = data.districtDesc;
      this.getBlock();
  }

  openGenericLOV(selector){
      if(selector == 'province'){
          this.passLOV.regionCd = this.locData.regionCd;
      }else if(selector == "city"){
          this.passLOV.regionCd = this.locData.regionCd;
          this.passLOV.provinceCd = this.locData.provinceCd;
      }else if(selector == 'district'){
          this.passLOV.regionCd = this.locData.regionCd;
          this.passLOV.provinceCd = this.locData.provinceCd;
          this.passLOV.cityCd = this.locData.cityCd;
      }
      this.passLOV.selector = selector;
      this.lovMdl.openLOV();
  }

  checkCode(ev, field){
        if(field === 'region'){
            this.oldValue = this.locData.regionCd;
            if (this.locData.regionCd == null || this.locData.regionCd == '') {
                this.locData.regionCd = '';
                this.locData.regionDesc = '';
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.locData.cityCd = '';
                this.locData.cityDesc = '';
                this.locData.districtCd = ''
                this.locData.districtDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('region', this.locData.regionCd, '', '', '', '', ev);
            }
        } else if(field === 'province'){
            this.oldValue = this.locData.provinceCd;
            if (this.locData.provinceCd == null || this.locData.provinceCd == '') {
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.locData.cityCd = '';
                this.locData.cityDesc = '';
                this.locData.districtCd = ''
                this.locData.districtDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('province', this.locData.regionCd, this.locData.provinceCd, '', '', '', ev);
            }
        } else if(field === 'city'){
            this.oldValue = this.locData.cityCd;
            if (this.locData.cityCd == null || this.locData.cityCd == '') {
                this.locData.cityCd = '';
                this.locData.cityDesc = '';
                this.locData.districtCd = ''
                this.locData.districtDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('city', this.locData.regionCd, this.locData.provinceCd, this.locData.cityCd, '', '', ev);
            }
        }   else if(field === 'district') {
            this.oldValue = this.locData.districtCd;
            if (this.locData.districtCd == null || this.locData.districtCd == '') {
                this.locData.districtCd = '';
                this.locData.districtDesc = '';   
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('district',this.locData.regionCd, this.locData.provinceCd, this.locData.cityCd, this.locData.districtCd, '', ev);
            }
        }
    }

    setCity(data){
        this.locData.cityCd = data.cityCd;
        this.locData.cityDesc = data.cityDesc;
    }
    setRegion(data){
        this.locData.regionCd = data.regionCd;
        this.locData.regionDesc = data.regionDesc;
    }
    setProvince(data){
        this.locData.provinceCd = data.provinceCd;
        this.locData.provinceDesc = data.provinceDesc;
    }

    setLOVField(data){
        this.ns.lovLoader(data.ev, 0);
        var resetSucceedingFields = false;

        if(data.selector == 'region'){
            if (data.data == null) {
                this.setRegion(data);
                if (this.oldValue = data.regionCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                if (this.oldValue = data.data.regionCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.locData.provinceCd = '';
                this.locData.provinceDesc = '';
                this.locData.cityCd = '';
                this.locData.cityDesc = '';
                this.locData.districtCd = '';
                this.locData.districtDesc = '';
            }

        } else if(data.selector == 'province'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                if (this.oldValue = data.provinceList[0].provinceCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                if (this.oldValue = data.data.provinceCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.locData.districtCd = '';
                this.locData.districtDesc = '';
                this.locData.cityCd = '';
                this.locData.cityDesc = '';
            }

        } else if(data.selector == 'city'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].cityCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                if (this.oldValue = data.data.cityCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.locData.districtCd = '';
                this.locData.districtDesc = '';
                this.locData.blockCd = '';
                this.locData.blockDesc = '';
            }

        }else if(data.selector == 'district'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                this.setDistrict(data.provinceList[0].cityList[0].districtList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].districtList[0].districtCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                this.setDistrict(data.data);
                if (this.oldValue = data.data.cityCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.locData.blockCd = '';
                this.locData.blockDesc = '';
            }

        }

        this.ns.lovLoader(data.ev, 0);
    }

}
