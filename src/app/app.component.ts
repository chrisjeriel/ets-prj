import { Component, Inject,  ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { HostListener, ElementRef } from '@angular/core';
import { AuthenticationService, NotesService } from './_services';
import { User } from './_models';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService, SecurityService } from './_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

import { ChangeDetectorRef } from '@angular/core';



@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent  {

    @ViewChild('warningConfirmation') warningConfirmation: ModalComponent;
    @ViewChild(SucessDialogComponent)  successDialog: SucessDialogComponent;

    datetime: number;
    currentUser: User;
    public style: object = {};
    accessibleModules: string[] = [];
    moduleId:string = 'MAIN';


    private _opened: boolean = true; /*must be added*/
    private _closeOnClickOutside: boolean = true; /*must be added*/

    private _toggleOpened(): void {
        this._opened = !this._opened;
    }

    private _toggleCloseOnClickOutside(): void {
        this._closeOnClickOutside = !this._closeOnClickOutside;
    }
    content: any;
    theme : any;
    constructor(
     private cdRef:ChangeDetectorRef,
     private router: Router,
     private userService: UserService,
     private authenticationService: AuthenticationService,
     config: NgbModalConfig,
     public modalService: NgbModal,
     private eRef: ElementRef,
     public ns: NotesService,
     private securityService: SecurityService,
     @Inject(DOCUMENT) private document) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        setInterval(() => {
            this.datetime = Date.now();
        }, 1);
        config.backdrop = 'static';
        config.keyboard = false;
    }

    onClickHome(){
        this.router.navigateByUrl('/dummy', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/']));
    }

    logout() {
        //this.authenticationService.logout();
        this.router.navigate(['/logout']);
    }

    open(content) {

        this.content = content;
        this.modalService.dismissAll();
        this.modalService.open(this.content, { centered: true , windowClass : 'modal-size'} );
    }
        
    changeTheme(color : string){

      if(color == 'green'){
        window.localStorage.removeItem("selectedTheme");
        window.localStorage.setItem("selectedTheme", 'green');
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'assets/css/stylesGreen.css'; // you may want to get this from local storage or location
        head.appendChild(link);
      } else if (color == 'red'){
        window.localStorage.removeItem("selectedTheme");
        window.localStorage.setItem("selectedTheme", 'red');
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'assets/css/stylesRed.css'; // you may want to get this from local storage or location
        head.appendChild(link);
      } else if (color == 'pink'){
        window.localStorage.removeItem("selectedTheme");
        window.localStorage.setItem("selectedTheme", 'pink');
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'assets/css/stylesPink.css'; // you may want to get this from local storage or location
        head.appendChild(link);
      } else if (color == 'indigo'){
        window.localStorage.removeItem("selectedTheme");
        window.localStorage.setItem("selectedTheme", 'indigo');
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'assets/css/stylesIndigo.css'; // you may want to get this from local storage or location
        head.appendChild(link);
      } else {
        window.localStorage.removeItem("selectedTheme");
        window.localStorage.setItem("selectedTheme", 'undefined');
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'assets/css/stylesDefault.css'; // you may want to get this from local storage or location
        head.appendChild(link);

      }

    }

    applyTheme(){
        this.theme = window.localStorage.getItem("selectedTheme");
    }

    ngOnInit(){
        this.theme = window.localStorage.getItem("selectedTheme");
        this.changeTheme(this.theme);

        this.userService.moduleIdObs.subscribe(value => {
            this.moduleId = value;
            this.cdRef.detectChanges();
        });

        if (this.currentUser != null) {
            this.userService.userLogin(this.currentUser.username, this.currentUser.password).subscribe(data => {
                localStorage.setItem('accessModules', JSON.stringify(data['modulesList']));
                this.userService.emitAccessModules(data['modulesList']);
            });
        };

        this.userService.accessibleModules.subscribe(value => {
            this.accessibleModules = value;
        });

        
    }
    
    @HostListener('window:unload', ['$event'])
    unloadHandler(event) {
        window.localStorage.setItem("selectedTheme", this.theme);
    }

    confirmationMessage: string;
    onClickConfirmation(){
        this.confirmationMessage = "Are you sure you want to change password for selected user?";
        this.warningConfirmation.openNoClose();
    }

    changePassObj:any = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    dialogIcon:string;
    dialogMessage:string;

    confirmChangePassword() {

    if (this.changePassObj.oldPassword == '' || this.changePassObj.newPassword == '' || this.changePassObj.confirmPassword == '') {
      this.dialogIcon = "error";
      this.successDialog.open();
    } else {

      this.securityService.secEncryption(this.changePassObj.oldPassword).subscribe((data:any)=>{


          if (data.password != this.currentUser.password) {
            this.dialogIcon = "error-message";
            this.dialogMessage = 'Old password mismatched.';
            this.successDialog.open();
            return;
          }

          if (this.changePassObj.newPassword != this.changePassObj.confirmPassword) {
            this.dialogIcon = "error-message";
            this.dialogMessage = 'Confirm password mismatched.';
            this.successDialog.open();
            return;
          }

          let saveUsersList = 
              {
                  usersList:
                      [{
                          userId : this.currentUser.username,
                          password :this.changePassObj.newPassword,
                          updateUser: this.currentUser.username,
                          decPass: data.password
                      }]
              }

          ;

          
            this.userService.saveMtnUser(saveUsersList).subscribe((data:any)=>{
                if (data["errorList"].length > 0) {
                  this.dialogIcon = "error";
                  this.dialogMessage = data["errorList"][0].errorMessage;
                  this.successDialog.open();
                } else {
                  this.changePassObj.oldPassword = "";
                  this.changePassObj.newPassword = "";
                  this.changePassObj.confirmPassword = "";
                  this.currentUser.password = data.password;
                  this.modalService.dismissAll();

                  this.dialogIcon = "success-message";
                  this.dialogMessage = 'Password changed successfully!';
                  this.successDialog.open();
                }
            },
            (err) => {
              console.log(err)
              alert("Exception when calling services.");
            });
          
      },
      (err) => {
          console.log(err);
          alert("Exception when calling services.");
      });

    }

  }


  test(data){
      console.log(data);
  }
}

