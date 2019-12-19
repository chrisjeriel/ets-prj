import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { NotesService } from '@app/_services/notes.service';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { UnderwritingService, MaintenanceService } from '../../../_services';

import * as alasql from 'alasql';

@Component({
    selector: 'app-risk-list',
    templateUrl: './risk-list.component.html',
    styleUrls: ['./risk-list.component.css']
})
export class RiskListComponent implements OnInit {
    @ViewChild(LoadingTableComponent) table: LoadingTableComponent;
    @ViewChild(NgbTabset) tabset: NgbTabset;
    maintenanceRiskListData: any = {
        tableData: [],
        tHeader: ['Risk No.', 'Risk Name', 'Abbreviation', 'Active', 'Region', 'Province', 'City/Town', 'District', 'Block', 'Lat', 'Long'],
        dataTypes: ['sequence-5', 'text', 'text', 'checkbox', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, false, true, false, true, true, true, true, true, true, true],
        tableOnly: false,
        addFlag: true,
        editFlag: true,
        exportFlag: true,
        pageStatus: true,
        pagination: true,
        pageLength: 15,
        keys: ['riskId','riskName','riskAbbr','activeTag','regionDesc','provinceDesc','cityDesc','districtDesc','blockDesc','latitude','longitude'],
        sortKeys :['RISK_ID','RISK_NAME','RISK_ABBR','ACTIVE_TAG','REGION_DESC','PROVINCE_DESC','CITY_DESC','DISTRICT_DESC','BLOCK_DESC','LATITUDE','LONGITUDE'],
        filters: [
            {
                key: 'riskId',
                title: 'Risk No.',
                dataType: 'text'
            },
            {
                key: 'riskName',
                title: 'Risk Name',
                dataType: 'text'
            },
            {
                key: 'riskAbbr',
                title: 'Risk Abbr.',
                dataType: 'text'
            },
            {
                key: 'regionDesc',
                title: 'Region',
                dataType: 'text'
            },
            {
                key: 'provinceDesc',
                title: 'Province',
                dataType: 'text'
            },
            {
                key: 'cityDesc',
                title: 'City',
                dataType: 'text'
            },
            {
                key: 'districtDesc',
                title: 'District',
                dataType: 'text'
            },
            {
                key: 'blockDesc',
                title: 'Block',
                dataType: 'text'
            },
            {
                key: 'latitude',
                title: 'Latitude',
                dataType: 'text'
            },
            {
                key: 'longitude',
                title: 'Longitude',
                dataType: 'text'
            }
        ]
    }
    selected:any;
    // searchParams: any[] = [];
    searchParams: any = {
        'paginationRequest.count':15,
        'paginationRequest.position':1,        
    };

    
    constructor(private titleService: Title, private underwritingService: UnderwritingService, 
                private maintenanceService: MaintenanceService, private router: Router, private ns: NotesService) { }

    ngOnInit() {
        this.titleService.setTitle('Pol | Risk');
        this.retrieveRiskListingMethod();
        
    }

    retrieveRiskListingMethod(){
        this.maintenanceService.getNewMtnRiskListing(this.searchParams).subscribe(data => {
            var records = data['risk'];
            //this.maintenanceRiskListData.tableData = records
            this.maintenanceRiskListData.count = data['count'];
            this.table.placeData(records);
        },
        (error)=>{
            this.table.loadingTableFlag = false;
        });
    }
    
    onClickAdd(event){
        this.router.navigate(['/maintenance-risk', { info: 'new'}], {skipLocationChange: true});
    }
    
    onClickEdit(event){
        this.router.navigate(['/maintenance-risk',this.selected], {skipLocationChange: true});
    }

    onRowClick(data){
        this.selected = data;
    }

    onRowDblClick(data){
       this.selected = data;
       this.router.navigate(['/maintenance-risk',this.selected], {skipLocationChange: true});
    }

    //Method for DB query
    searchQuery(searchParams){
        for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }        
        this.retrieveRiskListingMethod();
    }

    export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'MtnRiskList_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

       alasql.fn.currency = function(currency) {
            var parts = parseFloat(currency).toFixed(2).split(".");
            var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                (parts[1] ? "." + parts[1] : "");
            return num
      };

      let params = JSON.parse(JSON.stringify(this.searchParams));
      delete params['paginationRequest.count'];
      delete params['paginationRequest.position'];
      this.maintenanceService.getNewMtnRiskListing(params).subscribe(a=>{
          var importData: any[] = [];
          for(var i of a['risk']){
              i.latitude = i.latitude === null ? '' : i.latitude;
              i.longitude = i.longitude === null ? '' : i.longitude;
              i.remarks = i.remarks === null ? '' : i.remarks;
              i.districtDesc = i.districtDesc === null ? '' : i.districtDesc;
              i.blockDesc = i.blockDesc === null ? '' : i.blockDesc;
              importData.push(i);
          }

          alasql('SELECT riskId AS RiskNo, riskName AS RiskName, riskAbbr AS RiskAbbrev, activeTag AS ActiveTag, regionDesc AS Region, '+
                 'provinceDesc AS Province, cityDesc AS City, districtDesc AS District, blockDesc AS Block, latitude AS Latitude, longitude AS Longitude '+
                 'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,importData]);
      })
        
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('/maintenance-qu-pol');
      }
  }

}
