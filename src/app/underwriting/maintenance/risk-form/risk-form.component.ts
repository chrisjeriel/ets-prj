import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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


    constructor(private route: ActivatedRoute, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Risk");

        this.sub = this.route.params.subscribe(params => {
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
        console.log(data);
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

}
