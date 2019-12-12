import { Component, Inject,  ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { HostListener, ElementRef } from '@angular/core';
import { AuthenticationService, NotesService, WorkFlowManagerService } from './_services';
import { User } from './_models';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService, SecurityService } from './_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

import { ChangeDetectorRef } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';



@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnDestroy {

    @ViewChild('warningConfirmation') warningConfirmation: ModalComponent;
    @ViewChild(SucessDialogComponent)  successDialog: SucessDialogComponent;

    datetime: number;
    currentUser: User;
    public style: object = {};
    accessibleModules: string[] = [];
    moduleId:string = 'MAIN';
    notifToggle:boolean = false;

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
     private workFlowManagerService: WorkFlowManagerService,
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

    webSocketEndPoint: string = environment.prodApiUrl + '/notifications';
    topic: string = "/notif-sync";
    stompClient: any;
    notifCount:number = 0;
    notifs:Array<Object> = [];
    notifIsLoading:boolean = false;

    wsConnect() {
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect({}, function (frame) {
          _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
              let obj = JSON.parse(sdkEvent.body);
              console.log(obj);
              for (let ob of obj) {
                if (ob.user == _this.currentUser.username) {
                  _this.notifCount = ob.count;
                  if (_this.notifToggle) {
                    _this.loadNotif();
                  }
                }
              }
          });
      }, this.errorCallBack);
    };

    wsDisconnect() {
      if (this.stompClient !== null) {
          this.stompClient.disconnect();
      }
    }

    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this.wsConnect();
        }, 5000);
    }

    ngOnDestroy() {
      this.wsDisconnect();
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

            $(document).on("click", function(e:any) {
              console.log(e);
              console.log("id: " + e.target.id);
              console.log("id: " + e.target);
            })
        });

        this.wsConnect();
        this.loadNotif();
    }
    
    @HostListener('window:unload', ['$event'])
    unloadHandler(event) {
        window.localStorage.setItem("selectedTheme", this.theme);
    }

    confirmationMessage: string;
    onClickConfirmation(){
        this.confirmationMessage = "Are you sure you want to change password?";
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

  //
  loadNotif() {
    this.notifs = [];
    this.notifIsLoading = true;

    this.workFlowManagerService.retrieveWfmNotes('', this.currentUser.username, '', '', '', 'A').subscribe((data:any) => {
      if (data != null) {
        if (data.noteList.length > 0) {
          for (let obj of data.noteList) {
            this.notifs.push({ id: obj.noteId, title: obj.title, msg: obj.note, assignee: obj.createUser, createDate: obj.createDate });
          }
        }
      }
    });

    this.workFlowManagerService.retrieveWfmReminders('', this.currentUser.username, '', '', '', 'A').subscribe((data:any) => {
      if (data != null) {
        if (data.reminderList.length > 0) {
          for (let obj of data.reminderList) {
            this.notifs.push({ id: obj.reminderId, title: obj.title, msg: obj.reminder, assignee: obj.createUser, createDate: obj.createDate });
          }
        }
      }
      this.notifs.sort((a:any, b:any) => (a.createDate < b.createDate) ? 1 : -1);
      this.notifIsLoading = false;
      this.notifCount = this.notifs.length;
      
    });

    /*setTimeout(()=> {
      if (this.notifs.length > 0) {
        this.notifs.sort((a:any, b:any) => (a.createData < b.createDate) ? 1 : -1);
      }
    }, 500)*/

    console.log(this.notifs);
  }

  onClickNotif(event) {
    let btns = $('#bell-btns');
    let nc = $('#notif-context');
    this.notifToggle = !this.notifToggle;

    if (this.notifToggle) {
      this.loadNotif();
      if (this._opened) {
        setTimeout(() => {
          $("#notif-context").css({
              display: "block",
              top: (btns[0].offsetHeight+btns[0].offsetTop),
              left: ((btns[0].offsetLeft+btns[0].offsetWidth) - (nc[0].clientWidth+10+8))
          }).addClass("show");
          $("#notif-context").css({
              display: "block",
              top: (btns[0].offsetHeight+btns[0].offsetTop),
              left: ((btns[0].offsetLeft+btns[0].offsetWidth) - (nc[0].clientWidth+10+8) )
          }).addClass("show");
        }, 400);
      } else {
        $("#notif-context").css({
            display: "block",
            top: (btns[0].offsetHeight+btns[0].offsetTop),
            left: ((btns[0].offsetLeft+btns[0].offsetWidth) - (nc[0].clientWidth+10+8))
        }).addClass("show");
        $("#notif-context").css({
            display: "block",
            top: (btns[0].offsetHeight+btns[0].offsetTop),
            left: ((btns[0].offsetLeft+btns[0].offsetWidth) - (nc[0].clientWidth+10+8) )
        }).addClass("show");
      }
    } else {
      $("#notif-context").removeClass("show").hide();
    }
    
  }
}

