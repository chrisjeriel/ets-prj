import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NotesService } from '@app/_services/notes.service';

import { UnderwritingService, MaintenanceService } from '../../../_services';

import * as alasql from 'alasql';

@Component({
    selector: 'app-risk-list',
    templateUrl: './risk-list.component.html',
    styleUrls: ['./risk-list.component.css']
})
export class RiskListComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

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
    searchParams: any[] = [];
    
    constructor(private titleService: Title, private underwritingService: UnderwritingService, 
                private maintenanceService: MaintenanceService, private router: Router, private ns: NotesService) { }

    ngOnInit() {
        this.titleService.setTitle('Pol | Risk');
        this.retrieveRiskListingMethod();
        
    }

    retrieveRiskListingMethod(){
        this.maintenanceService.getMtnRiskListing(this.searchParams).subscribe(data => {
            var records = data['risk'];
            for(let rec of records){
                this.maintenanceRiskListData.tableData.push(
                    rec
                // {
                //     activeTag: (rec.activeTag.toUpperCase() === 'Y'),
                //     riskId: rec.riskId,
                //     riskName: rec.riskName,
                //     riskAbbr: rec.riskAbbr,
                //     regionDesc: rec.regionDesc,
                //     provinceDesc: rec.provinceDesc,
                //     cityDesc: rec.cityDesc,
                //     districtDesc: rec.districtDesc,
                //     blockDesc: rec.blockDesc,
                //     latitude: rec.latitude,
                //     longitude: rec.longitude
                // }
                );
            }
        
            this.table.refreshTable();
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
        this.searchParams = searchParams;
        this.maintenanceRiskListData.tableData = [];
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
    var filename = 'MtnRiskList_'+currDate+'.xlsx'
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

    var importData: any[] = [];
    for(var i of this.maintenanceRiskListData.tableData){
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
  }

}
