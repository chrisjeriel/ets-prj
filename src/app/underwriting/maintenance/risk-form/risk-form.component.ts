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

    setDistricts(data){
        console.log(data);
        this.districtCd = data.districtCd;
        this.districtName = data.districtDesc;
    }

    showBlockModal() {
        $('#blockModal #modalBtn').trigger('click');
    }
}
