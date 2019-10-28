import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, forkJoin } from 'rxjs';
import { MaintenanceService, NotesService, UserService, SecurityService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-override-login',
  templateUrl: './override-login.component.html',
  styleUrls: ['./override-login.component.css']
})
export class OverrideLoginComponent implements OnInit {

   @Input() approvalCd: string = '';
   @ViewChild('overrideMdl') overrideMdl: ModalComponent;
   @ViewChild(SucessDialogComponent) success: SucessDialogComponent;
   @Output() isSuccess: EventEmitter<any> = new EventEmitter<any>();

  constructor( private modalService: NgbModal, private ns: NotesService,
  			   private mtnService: MaintenanceService, private userService: UserService,
               private securityService: SecurityService) { }

  dialogIcon: string = '';
  dialogMessage: string = '';
  userId: string = '';
  password: string = '';

  result: boolean;

  approversList: any[] = [];
  usersList: any[] = [];
  allowedLogins: any[] = [];

  ngOnInit() {
  }

  //This function fetches the list of approvers, users, and users that have an authorization. Call this to your component everytime you
  //open the override login modal using ViewChild
  getApprovalFn(){
    $('.globalLoading').css('display','block');
    var subs =  forkJoin(this.mtnService.getMtnApprovalFunction(this.approvalCd),this.mtnService.getMtnApprover(), this.userService.retMtnUsers(''))
                  .pipe(map(([appFn, app, user]) => { return { appFn, app, user };}));

    subs.subscribe(data => {
      $('.globalLoading').css('display','none');
      this.allowedLogins = data['appFn']['approverFn'];  //List of users that has authorization on the specified approval code
      this.approversList = data['app']['approverList'];  //List of users that has authorization to approve
      this.usersList = data['user']['usersList'];        //List of users
    });
  }

  onOkOver(){
  	console.log(this.approversList);
    var user = this.approversList.some(e => this.userId.toUpperCase() == e.userId.toUpperCase());
    if(user){
      var pass = this.usersList.filter(e => this.userId.toUpperCase() == e.userId.toUpperCase()).map(e => e.password);

      this.securityService.secEncryption(this.password).subscribe((data:any)=>{
          if(data.password == pass.toString()){
            //Check if the user that was inputted in override is authorized.
            if(this.allowedLogins.map(a => {return a.userId}).includes(this.userId.toUpperCase())){
            	this.overrideMdl.closeModal();
            	this.dialogIcon = 'success-message';
            	this.dialogMessage = 'Login Successfully';
            	this.success.open();
            	this.result = true;
            	this.clearFields();
            }else{
            	this.dialogIcon = 'error-message';
            	this.dialogMessage = 'The user is not authorized for this action.';
            	this.success.open();
            	this.result = false;
            }
          } else{
            this.dialogIcon = 'error-message';
            this.dialogMessage = 'Invalid Password';
            this.success.open();
            this.result = false;
          }
        });
    }else{
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Invalid Username';
      this.success.open();
      this.result = false;
    }
    
  }

  //When login is successful, this method will run and emit a boolean value of 'true'
  //Else return 'false'. Using the emitted value, perform your logic in your own component.
  resultMethod(){
  	this.isSuccess.emit(this.result);;
  }

  clearFields(){
  	this.userId = '';
  	this.password = '';
  }

}
