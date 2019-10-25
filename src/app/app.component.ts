import { Component, Inject,  ViewChild,} from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { HostListener, ElementRef } from '@angular/core';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService } from './_services';

@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent  {
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
     private router: Router,
     private userService: UserService,
     private authenticationService: AuthenticationService,
     config: NgbModalConfig,
     public modalService: NgbModal,
     private eRef: ElementRef,
     @Inject(DOCUMENT) private document) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        setInterval(() => {
            this.datetime = Date.now();
        }, 1);
        config.backdrop = 'static';
        config.keyboard = false;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
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
        });

        if (this.currentUser != null) {
            this.userService.userLogin(this.currentUser.username, this.currentUser.password).subscribe(data => {
                console.log("AppComponent : ");
                console.log(data['modulesList']);
                console.log("-------------");
                localStorage.setItem('accessModules', JSON.stringify(data['modulesList']));
                this.userService.emitAccessModules(data['modulesList']);
            });
        };

        this.userService.accessibleModules.subscribe(value => {
            this.accessibleModules = value;

            console.log("accessibleModules Retrieved : " + this.accessibleModules);
        });

        
    }
    
    @HostListener('window:unload', ['$event'])
    unloadHandler(event) {
        window.localStorage.setItem("selectedTheme", this.theme);
    }

}

