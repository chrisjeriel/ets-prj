import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService, NotesService, AuthenticationService } from '@app/_services';
import { MtnDistrictComponent } from '@app/maintenance/mtn-district/mtn-district.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { User } from '@app/_models';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
    selector: 'app-risk-form',
    templateUrl: './risk-form.component.html',
    styleUrls: ['./risk-form.component.css']
})
export class RiskFormComponent implements OnInit, OnDestroy {


    @ViewChild(LovComponent) lovMdl: LovComponent;
    @ViewChild(MtnDistrictComponent) districtLov: MtnDistrictComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
    @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
    @ViewChild('myForm') form: any;

    private sub: any;
    info: string;
    newForm: boolean;
    districtCd:string = "";
    districtName:string = "";
    cityCd: string = "";
    cityDesc: string = "";
    blockCd: string = "";
    blockDesc: string = "";
    zoneCd: string = "";
    zoneDesc: string = "";
    passLOV:any = {};
    oldValue: any= "";
    riskData:any = 
        {
            activeTag : 'Y',
            blockCd : null,
            blockDesc : null,
            cityCd : null,
            cityDesc : null,
            createDate : this.ns.toDateTimeString(0),
            createUser : null,
            districtCd : null,
            districtDesc : null,
            latitude : null,
            longitude : null,
            provinceCd : null,
            provinceDesc : null,
            regionCd : null,
            regionDesc : null,
            remarks : null,
            riskAbbr : null,
            riskId : null,
            riskName : null,
            updateDate : this.ns.toDateTimeString(0),
            updateUser : null,
            zoneCd : null,
            zoneDesc : null,
        }
    errorMdlMessage:any;
    currentUser: User;

    dialogIcon: string = "";
    dialogMessage: string = "";
    cancelFlag: boolean = false;


    constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, private titleService: Title, private router: Router,private mtnService: MaintenanceService,private modalService: NgbModal, private ns: NotesService ) { }

    ngOnInit() {

        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        this.titleService.setTitle("Pol | Risk");

        this.sub = this.route.params.subscribe(params => {
            console.log(params)
            if(params.info == undefined){
                this.riskData = JSON.parse(JSON.stringify(params));
                this.riskData.createDate = this.ns.toDateTimeString(parseInt(this.riskData.createDate)).split('T')[0];
                this.riskData.updateDate = this.ns.toDateTimeString(parseInt(this.riskData.updateDate)).split('T')[0];
                /*this.riskData.updateDate = 
                    this.riskData.updateDate.split(/[,]/g)[0]+'-'+
                    ("0"+this.riskData.updateDate.split(/[,]/g)[1]).slice(-2)+'-'+
                    ("0"+this.riskData.updateDate.split(/[,]/g)[2]).slice(-2);
                this.riskData.createDate = 
                    this.riskData.createDate.split(/[,]/g)[0]+'-'+
                    ("0"+this.riskData.createDate.split(/[,]/g)[1]).slice(-2)+'-'+
                    ("0"+this.riskData.createDate.split(/[,]/g)[2]).slice(-2);*/
                for(let key in this.riskData){
                    this.riskData[key] = this.riskData[key]=="null" ? '' : this.riskData[key];
                }
            }
            else
                this.info = params['info'];
        });
        if(this.info == 'new'){
            this.newForm = true;
        }else{
            this.newForm = false;
        }

        console.log(this.riskData.activeTag);

        

        setTimeout(() => {
            $('input[riskdesc]').focus();
        },0) 
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

    showDistrictModal() {
        $('#districtModal #modalBtn').trigger('click');
    }

    showCityModal(){
        $('#cityModal #modalBtn').trigger('click');
    }

    showCrestaZoneModal(){
        $('#crestaZoneModal #modalBtn').trigger('click');
    }

    setDistrict(data){
        this.riskData.districtCd = data.districtCd;
        this.riskData.districtDesc = data.districtDesc;
    }

    showBlockModal() {
        $('#blockModal #modalBtn').trigger('click');
    }

    setCity(data){
        this.riskData.cityCd = data.cityCd;
        this.riskData.cityDesc = data.cityDesc;
    }
    setBlock(data){
        this.riskData.blockCd = data.blockCd;
        this.riskData.blockDesc = data.blockDesc;
    }

    setCrestaZone(data){
        this.riskData.zoneCd = data.zoneCd;
        this.riskData.zoneDesc = data.zoneDesc;
    }

    setRegion(data){
        this.riskData.regionCd = data.regionCd;
        this.riskData.regionDesc = data.regionDesc;
    }

    setProvince(data){
        this.riskData.provinceCd = data.provinceCd;
        this.riskData.provinceDesc = data.provinceDesc;
    }

    openGenericLOV(selector){
        if(selector == 'province'){
            this.passLOV.regionCd = this.riskData.regionCd;
        }else if(selector == "city"){
            this.passLOV.regionCd = this.riskData.regionCd;
            this.passLOV.provinceCd = this.riskData.provinceCd;
        }else if(selector == 'district'){
            this.passLOV.regionCd = this.riskData.regionCd;
            this.passLOV.provinceCd = this.riskData.provinceCd;
            this.passLOV.cityCd = this.riskData.cityCd;
        }else if(selector == 'block'){
            this.passLOV.regionCd = this.riskData.regionCd;
            this.passLOV.provinceCd = this.riskData.provinceCd;
            this.passLOV.cityCd = this.riskData.cityCd;
            this.passLOV.districtCd = this.riskData.districtCd;
        }
        this.passLOV.selector = selector;
        this.lovMdl.openLOV();
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
                this.riskData.provinceCd = '';
                this.riskData.provinceDesc = '';
                this.riskData.cityCd = '';
                this.riskData.cityDesc = '';
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
                this.riskData.zoneCd = '';
                this.riskData.zoneDesc = '';
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
                this.riskData.cityCd = '';
                this.riskData.cityDesc = '';
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
                this.riskData.zoneCd = '';
                this.riskData.zoneDesc = '';
            }

        } else if(data.selector == 'city'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                this.setCrestaZone(data.provinceList[0].cityList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].cityCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                this.setCrestaZone(data.data);
                if (this.oldValue = data.data.cityCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
            }

        } else if(data.selector == 'district'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                this.setCrestaZone(data.provinceList[0].cityList[0]);
                this.setDistrict(data.provinceList[0].cityList[0].districtList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].districtList[0].districtCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                this.setCrestaZone(data.data);
                this.setDistrict(data.data);
                if (this.oldValue = data.data.cityCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
            }

        } else if(data.selector == 'block'){
            if (data.data == null) {
                this.setRegion(data);
                this.setProvince(data.provinceList[0]);
                this.setCity(data.provinceList[0].cityList[0]);
                this.setCrestaZone(data.provinceList[0].cityList[0]);
                this.setDistrict(data.provinceList[0].cityList[0].districtList[0]);
                this.setBlock(data.provinceList[0].cityList[0].districtList[0].blockList[0]);
                if (this.oldValue = data.provinceList[0].cityList[0].districtList[0].blockList[0].blockCd) {
                    resetSucceedingFields = true;
                }
            } else {
                this.setRegion(data.data);
                this.setProvince(data.data);
                this.setCity(data.data);
                this.setCrestaZone(data.data);
                this.setDistrict(data.data);
                this.setBlock(data.data);
                if (this.oldValue = data.data.blockCd) {
                    resetSucceedingFields = true;
                }
            }

            if (resetSucceedingFields) {

            }
        }

        this.ns.lovLoader(data.ev, 0);
    }

    onClickCancel(){
        //this.router.navigate(['/maintenance-risk-list'], {skipLocationChange: true});
        this.cancelBtn.clickCancel();
    }

    save(cancelFlag?){
        this.cancelFlag = cancelFlag !== undefined;
        this.riskData.createUser = this.currentUser.username;
        this.riskData.updateUser = this.currentUser.username;
        console.log(JSON.stringify(this.riskData));
        this.mtnService.saveMtnRisk(this.riskData).subscribe((data:any)=>{
            if(data['returnCode'] == 0) {
              /*this.errorMdlMessage = data['errorList'][0].errorMessage;
              $('#errorMdl > #modalBtn').trigger('click');*/
              if(this.cancelFlag){
                this.cancelFlag = false;
              }
              this.dialogIcon = "error";
              this.successDiag.open();
            } else{
              this.dialogIcon = "";
              this.successDiag.open();
              //this.riskData.riskId = data.riskId;
              this.mtnService.getMtnRisk(data.riskId).subscribe((data: any)=>{
                  this.riskData = data.risk;
                  this.riskData.createDate = this.ns.toDateTimeString(this.riskData.createDate).split('T')[0];
                  this.riskData.updateDate = this.ns.toDateTimeString(this.riskData.updateDate).split('T')[0];
              });
             }
        });
    }

    onClickSave(){
        if(this.riskData.riskName === null || this.riskData.riskName.length === 0 ||
           this.riskData.riskAbbr === null || this.riskData.riskAbbr.length === 0 ||
           this.riskData.regionCd === null || this.riskData.regionCd.length === 0 ||
           this.riskData.regionDesc === null || this.riskData.regionDesc.length === 0 ||
           this.riskData.provinceCd === null || this.riskData.provinceCd.length === 0 ||
           this.riskData.provinceDesc === null || this.riskData.provinceDesc.length === 0 ||
           this.riskData.cityCd === null || this.riskData.cityCd.length === 0 ||
           this.riskData.cityDesc === null || this.riskData.cityDesc.length === 0){

            this.dialogIcon = "error";
            this.successDiag.open();
        }else{
            $('#confirm-save #modalBtn2').trigger('click');
        }
    }


    test(event){
        console.log(event)
    }

    checkCode(ev, field){
        if(field === 'region'){
            this.oldValue = this.riskData.regionCd;
            if (this.riskData.regionCd == null || this.riskData.regionCd == '') {
                this.riskData.regionCd = '';
                this.riskData.regionDesc = '';
                this.riskData.provinceCd = '';
                this.riskData.provinceDesc = '';
                this.riskData.cityCd = '';
                this.riskData.cityDesc = '';
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
                this.riskData.zoneCd = '';
                this.riskData.zoneDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('region', this.riskData.regionCd, '', '', '', '', ev);
            }
        } else if(field === 'province'){
            this.oldValue = this.riskData.provinceCd;
            if (this.riskData.provinceCd == null || this.riskData.provinceCd == '') {
                this.riskData.provinceCd = '';
                this.riskData.provinceDesc = '';
                this.riskData.cityCd = '';
                this.riskData.cityDesc = '';
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
                this.riskData.zoneCd = '';
                this.riskData.zoneDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('province', this.riskData.regionCd, this.riskData.provinceCd, '', '', '', ev);
            }
        } else if(field === 'city'){
            this.oldValue = this.riskData.cityCd;
            if (this.riskData.cityCd == null || this.riskData.cityCd == '') {
                this.riskData.cityCd = '';
                this.riskData.cityDesc = '';
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
                this.riskData.zoneCd = '';
                this.riskData.zoneDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('city', this.riskData.regionCd, this.riskData.provinceCd, this.riskData.cityCd, '', '', ev);
            }
        } else if(field === 'district') {
            this.oldValue = this.riskData.districtCd;
            if (this.riskData.districtCd == null || this.riskData.districtCd == '') {
                this.riskData.districtCd = '';
                this.riskData.districtDesc = '';
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('district',this.riskData.regionCd, this.riskData.provinceCd, this.riskData.cityCd, this.riskData.districtCd, '', ev);
            }
        } else if(field === 'block') {
            this.oldValue = this.riskData.blockCd;
            if (this.riskData.blockCd == null || this.riskData.blockCd == '') {
                this.riskData.blockCd = '';
                this.riskData.blockDesc = '';
            } else {
                this.ns.lovLoader(ev, 1);
                this.lovMdl.checkCode('block',this.riskData.regionCd, this.riskData.provinceCd, this.riskData.cityCd, this.riskData.districtCd, this.riskData.blockCd, ev);
            }
        } /*else if(field === 'risk') {
            this.riskLov.checkCode(this.riskCd, ev);
        }      */        
    }
}
