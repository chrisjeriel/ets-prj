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
            activeTag : null,
            blockCd : null,
            blockDesc : null,
            cityCd : null,
            cityDesc : null,
            createDate : null,
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
            updateDate : null,
            updateUser : null,
            zoneCd : null,
            zoneDesc : null,
        }

    constructor(private route: ActivatedRoute, private titleService: Title, private router: Router,private mtnService: MaintenanceService ) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Risk");

        this.sub = this.route.params.subscribe(params => {
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
                console.log(this.riskData);
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
        this.districtCd = data.districtCd;
        this.districtName = data.districtDesc;
    }

    showBlockModal() {
        $('#blockModal #modalBtn').trigger('click');
    }

    setCity(data){
        this.cityCd = data.cityCd;
        this.cityDesc = data.cityDesc;
    }
    setBlock(data){
        this.blockCd = data.blockCd;
        this.blockDesc = data.blockDesc;
    }

    setCrestaZone(data){
        this.zoneCd = data.zoneCd;
        this.zoneDesc = data.zoneDesc;
    }

    openGenericLOV(selector){
        this.passLOV.selector = selector;
        $('#lov #modalBtn').trigger('click');
    }

    setLOVField(data){
        if(data.selector == 'city'){
            this.setCity(data.data);
        }else if(data.selector == 'district'){
            this.setDistricts(data.data);
        }
    }

    onClickCancel(){
        this.router.navigate(['/maintenance-risk-list'], {skipLocationChange: true});
    }

    save(){
        console.log(JSON.stringify(this.riskData));
        this.mtnService.saveMtnRisk(this.riskData).subscribe();
    }
}
