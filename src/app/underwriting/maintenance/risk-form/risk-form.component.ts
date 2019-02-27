import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService } from '@app/_services';

@Component({
    selector: 'app-risk-form',
    templateUrl: './risk-form.component.html',
    styleUrls: ['./risk-form.component.css']
})
export class RiskFormComponent implements OnInit, OnDestroy {
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
    riskData:any = 
        {
            activeTag : 'N',
            blockCd : null,
            blockDesc : null,
            cityCd : null,
            cityDesc : null,
            createDate : new Date().toISOString().split('T')[0],
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
            updateDate : new Date().toISOString().split('T')[0],
            updateUser : null,
            zoneCd : null,
            zoneDesc : null,
        }
    errorMdlMessage:any;

    constructor(private route: ActivatedRoute, private titleService: Title, private router: Router,private mtnService: MaintenanceService,private modalService: NgbModal ) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Risk");

        this.sub = this.route.params.subscribe(params => {
            console.log(params)
            if(params.info == undefined){
                this.riskData = JSON.parse(JSON.stringify(params));
                console.log(this.riskData.updateDate);
                this.riskData.updateDate = 
                    this.riskData.updateDate.split(/[,]/g)[0]+'-'+
                    ("0"+this.riskData.updateDate.split(/[,]/g)[1]).slice(-2)+'-'+
                    ("0"+this.riskData.updateDate.split(/[,]/g)[2]).slice(-2);
                this.riskData.createDate = 
                    this.riskData.createDate.split(/[,]/g)[0]+'-'+
                    ("0"+this.riskData.createDate.split(/[,]/g)[1]).slice(-2)+'-'+
                    ("0"+this.riskData.createDate.split(/[,]/g)[2]).slice(-2);
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

    setDistricts(data){
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
        $('#lov #modalBtn').trigger('click');
    }

    setLOVField(data){
        if(data.selector == 'city'){
            this.setCity(data.data);
        }else if(data.selector == 'district'){
            this.setDistricts(data.data);
        }else if(data.selector == 'region'){
            this.setRegion(data.data);
        }else if(data.selector == 'province'){
            this.setProvince(data.data);
        }else if(data.selector == 'block'){
            this.setBlock(data.data);
        }
    }

    onClickCancel(){
        this.router.navigate(['/maintenance-risk-list'], {skipLocationChange: true});
    }

    save(){
        console.log(JSON.stringify(this.riskData));
        this.mtnService.saveMtnRisk(this.riskData).subscribe((data:any)=>{
            if(data['returnCode'] == 0) {
              this.errorMdlMessage = data['errorList'][0].errorMessage;
              $('#errorMdl > #modalBtn').trigger('click');
            } else{
              $('#successModalBtn').trigger('click');
             }
        });
    }


    test(event){
        console.log(event)
    }
}
