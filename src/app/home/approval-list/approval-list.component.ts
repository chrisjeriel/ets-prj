import { Component, OnInit } from '@angular/core';
import { WorkFlowManagerService } from '@app/_services';

interface Module {
  module: string;
  details: string;
  assignedBy: string;
  assignedDate: string;
}

const MODULES: Module[] = [
  {
    module: 'Quotation',
    details: 'CAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Quotation',
    details: 'EAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Policy',
    details: 'DOS-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Policy',
    details: 'CAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Quotation',
    details: 'EAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Quotation',
    details: 'MBI-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Quotation',
    details: 'DOS-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Claim',
    details: 'CAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Quotation',
    details: 'EAR-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Claim',
    details: 'MBI-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
  {
    module: 'Claim',
    details: 'DOS-2019-000001-00-099',
    assignedBy: 'CASARSONAS',
    assignedDate: '04/22/2019 01:00 PM'
  },
];

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent implements OnInit {
  constructor(private workFlowManagerService: WorkFlowManagerService) {}

  modules = MODULES;

  approvalList: Module[] = [];

  ngOnInit() {
    this.retrieveWfmApprovals();
  }

  retrieveWfmApprovals() {
      this.workFlowManagerService.retrieveWfmApprovals('TOTZ').subscribe((data)=>{
          if (data["approvalList"].length > 0) {

            for (var i = data["approvalList"].length - 1; i >= 0; i--) {
              this.approvalList.push({'module' : data["approvalList"][i].module,
                                          'details' : data["approvalList"][i].quotationNo,
                                          'assignedBy' : data["approvalList"][i].preparedBy,
                                          'assignedDate' : data["approvalList"][i].createDate
                                        });
            }
          }
      })
  }

}



