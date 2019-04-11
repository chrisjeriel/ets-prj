import { Component, OnInit } from '@angular/core';
import { WorkFlowManagerService, AuthenticationService, QuotationService } from '@app/_services';
import { User } from '@app/_models';
import { Router } from '@angular/router';

interface Module {
  referenceId: string;
  module: string;
  details: string;
  assignedBy: string;
  assignedDate: string;
}

const MODULES: Module[] = [
  {
    referenceId: '1',
    module: 'Quotation',
    details: 'CAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '2',
    module: 'Quotation',
    details: 'EAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '3',
    module: 'Policy',
    details: 'DOS-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '4',
    module: 'Policy',
    details: 'CAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '5',
    module: 'Quotation',
    details: 'EAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '6',
    module: 'Quotation',
    details: 'MBI-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '7',
    module: 'Quotation',
    details: 'DOS-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '8',
    module: 'Claim',
    details: 'CAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '9',
    module: 'Quotation',
    details: 'EAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '10',
    module: 'Claim',
    details: 'MBI-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    referenceId: '11',
    module: 'Claim',
    details: 'DOS-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
];

interface Country {
  id?: number;
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'France',
    flag: 'c/c3/Flag_of_France.svg',
    area: 640679,
    population: 64979548
  },
  {
    name: 'Germany',
    flag: 'b/ba/Flag_of_Germany.svg',
    area: 357114,
    population: 82114224
  },
  {
    name: 'Portugal',
    flag: '5/5c/Flag_of_Portugal.svg',
    area: 92090,
    population: 10329506
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'Vietnam',
    flag: '2/21/Flag_of_Vietnam.svg',
    area: 331212,
    population: 95540800
  },
  {
    name: 'Brazil',
    flag: '0/05/Flag_of_Brazil.svg',
    area: 8515767,
    population: 209288278
  },
  {
    name: 'Mexico',
    flag: 'f/fc/Flag_of_Mexico.svg',
    area: 1964375,
    population: 129163276
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'India',
    flag: '4/41/Flag_of_India.svg',
    area: 3287263,
    population: 1324171354
  },
  {
    name: 'Indonesia',
    flag: '9/9f/Flag_of_Indonesia.svg',
    area: 1910931,
    population: 263991379
  },
  {
    name: 'Tuvalu',
    flag: '3/38/Flag_of_Tuvalu.svg',
    area: 26,
    population: 11097
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent implements OnInit {
  constructor(private workFlowManagerService: WorkFlowManagerService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private quotationService: QuotationService) {}

  currentUser: User;
  approvalList: Module[] = [];
  selectedData:any;
  page = 1;
  pageSize = 2;
  collectionSize:any;
  
  

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.retrieveWfmApprovals();

    $(document).ready(function(){
        $('.app-active-table').on('contextmenu', function(e) {
          var parentOffset = $(this).parent().offset(); 
         //or $(this).offset(); if you really just want the current element's offset
         var relX = e.pageX - parentOffset.left;
         var relY = e.pageY - parentOffset.top;
          $("#context-menu").css({
            display: "block",
            top: (relY + 35),
            left: (relX + 17)
          }).addClass("show");
          return false; //blocks default Webbrowser right click menu
        }).on("click", function() {
          $("#context-menu").removeClass("show").hide();
        });

        $("#context-menu a").on("click", function() {
          $(this).parent().removeClass("show").hide();
        });
    });
  }

  retrieveWfmApprovals() {
      this.workFlowManagerService.retrieveWfmApprovals(this.currentUser.username).subscribe((data)=>{
          if (data["approvalList"].length > 0) {
            this.collectionSize = data["approvalList"].length;

            console.log("Collection Size : " + this.collectionSize);

            for (var i = data["approvalList"].length - 1; i >= 0; i--) {
              this.approvalList.push({'referenceId' : data["approvalList"][i].referenceId,
                                          'module' : data["approvalList"][i].module,
                                          'details' : data["approvalList"][i].quotationNo,
                                          'assignedBy' : data["approvalList"][i].preparedBy,
                                          'assignedDate' : data["approvalList"][i].createDate
                                        });
            }
          }
      })
  }

  redirectToQuoteGenInfo() {
    var line = this.selectedData["details"].split("-")[0];

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", line);
    this.quotationService.savingType = 'normal';

    
    setTimeout(() => {
        this.router.navigate(['/quotation', { line: line,  quotationNo : this.selectedData["details"], quoteId: this.selectedData["referenceId"], from: 'quo-processing'}], { skipLocationChange: true });
    },100); 
  }

  onRowClick(event, mod) {
    console.log("Click Event: " + JSON.stringify(event));
    console.log("Click Mod: " + JSON.stringify(mod));
    this.selectedData = mod;
  }

  onRightClick(event, mod) {
    console.log("Click Event: " + JSON.stringify(event));
    console.log("Click Mod: " + JSON.stringify(mod));
    this.selectedData = mod;
  }


  

  /*get approvalListing(): Module[] {
    return MODULES
      .map((mod, i) => ({id: i + 1, ...mod}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  */

  /*get countries(): Country[] {
    return COUNTRIES
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }*/

}



