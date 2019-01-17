import { Component, Inject,  ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { HostListener, ElementRef } from '@angular/core';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/platform-browser';


@Component({ 
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent  {
    datetime: number;
    currentUser: User;
    public style: object = {};

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
     private authenticationService: AuthenticationService,
     config: NgbModalConfig,
     private modalService: NgbModal,
     private eRef: ElementRef,
     @Inject(DOCUMENT) private document

    ) {
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
       let colorList: any[]
       if (color == 'red'){
           window.localStorage.removeItem("selectedTheme");
           window.localStorage.setItem("selectedTheme", 'red');
           this.theme = window.localStorage.getItem("selectedTheme");
           colorList = ['#F44336','#D32F2F','#C62828'];
           this.setColorTheme(colorList[0],colorList[1],colorList[2],colorList[3]);
       } else if (color == 'pink'){
           window.localStorage.removeItem("selectedTheme");
           window.localStorage.setItem("selectedTheme", 'pink');
           this.theme = window.localStorage.getItem("selectedTheme");
           colorList = ['#E91E63','#F50057','#A61646'];
           this.setColorTheme(colorList[0],colorList[1],colorList[2],colorList[3]);
       } else if (color == 'green'){
           window.localStorage.removeItem("selectedTheme");
           window.localStorage.setItem("selectedTheme", 'green');
           this.theme = window.localStorage.getItem("selectedTheme");
           colorList = ['#4CAF50','#388E3C','#2E7D32', '#B2FF59'];
           this.setColorTheme(colorList[0],colorList[1],colorList[2],colorList[3]);
       } else if (color == 'indigo'){
           window.localStorage.removeItem("selectedTheme");
           window.localStorage.setItem("selectedTheme", 'indigo');
           this.theme = window.localStorage.getItem("selectedTheme");
           colorList = ['#3F51B5','#303F9F','#283593'];
           this.setColorTheme(colorList[0],colorList[1],colorList[2],colorList[3]);
       } else {
           window.localStorage.removeItem("selectedTheme");
           window.localStorage.setItem("selectedTheme", 'undefined');
           this.theme = window.localStorage.getItem("selectedTheme");
           this.setDefaultColorTheme();
       }

    }

    setDefaultColorTheme(){
         $('.modal-header').css({"background-color":"#557a95"});
         $('.cust-side-nav-bg').css({"background-color":"#00194A"});
         $('.cust-ng-sidebar').css({"background-color":"#00194A"});
         $("button.btn.btn-link").css({"color":"#0003B4"});    
         $('.cust-btn').css({"background":'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)'});     
          $(".cust-btn").hover(function() {
            $(this).css("background",'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)');
            }, function() {
            $(this).css("background",'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)');
            });
         $('.cust-filter').css({"background":'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)'});    
          $(".cust-filter").hover(function() {
            $(this).css("background",'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)');
            }, function() {
            $(this).css("background",'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)');
            }); 
         $('.dataTables_wrapper .dataTables_paginate .paginate_button.current').css({"background":'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)'});
           $(".progress-bar").each(function () {
                 this.style.setProperty('background', '#557a95', 'important');
           });
         $('legend.scheduler-border').css({"color":"#2D5986"});
         $(' aside.ng-sidebar ').css({"background-color":"#00194A"});
         $('.nav-link').css({"color":""});
         $('.ngx-pagination .current').css({"background":'linear-gradient(to bottom, #4080bf 0%, #2d5986 100%)'});
         $('.cust').css({"background":'linear-gradient(to bottom,#4080bf 0%, #2d5986 100%)'}); 
    }

    setColorTheme(color1 : string , color2 : string, color3 : string , color4 : string){
            $('.modal-header').css({"background-color":color1});
            $('.cust-side-nav-bg').css({"background-color":color3});
            $('.cust-ng-sidebar').css({"background-color":color3});
            $("button.btn.btn-link").css({"color":color2});
            $('.cust-btn').css({"background":'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)'});
            $(".cust-btn").hover(function() {
            $(this).css("background",'linear-gradient(to bottom,'+color1+' 0%, '+color2+' 100%)');
            }, function() {
            $(this).css("background",'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)');
            });
            $('.cust-filter').css({"background":'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)'});
            $(".cust-filter").hover(function() {
            $(this).css("background",'linear-gradient(to bottom,'+color1+' 0%, '+color2+' 100%)');
            }, function() {
            $(this).css("background",'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)');
            }); 
            setTimeout(() => {    
                $('.dataTables_wrapper .dataTables_paginate .paginate_button.current').css({"background":'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)'});
            });
            $(".progress-bar").each(function () {
                 this.style.setProperty('background', color1, 'important');
            });
            $('legend.scheduler-border').css({"color":color2});
            $(' aside.ng-sidebar ').css({"background-color":color3});
            $('.nav-link ').css({"color":color2});
            $('.nav-link.active ').css({"color":"#495057"});
            $('.ngx-pagination .current').css({"background":'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)'});
            $('.cust').css({"background":'linear-gradient(to bottom,'+color2+' 0%, '+color3+' 100%)'});
    }

    applyTheme(){
            this.theme = window.localStorage.getItem("selectedTheme");
    }

     @HostListener('document:click', ['$event'])
      clickout(event) {
        if(this.eRef.nativeElement.contains(event.target)) {
                      this.changeTheme(this.theme);
        } else {
                      this.changeTheme(this.theme);
        }
     }

 /*    @HostListener('document:keyup', ['$event'])
       handleKeyboardEvent(event: KeyboardEvent) { 
              if (event.key == 'Backspace' || event.key == ' ') {
                this.changeTheme(this.theme);
              }
    }*/

     ngOnInit(){
       this.theme = window.localStorage.getItem("selectedTheme");
           setTimeout(() => { this.changeTheme(this.theme);});

       this.router.events.subscribe(path => {
           setTimeout(() => { this.changeTheme(this.theme);});
        });

      }

    @HostListener('window:unload', ['$event'])
    unloadHandler(event) {
        window.localStorage.setItem("selectedTheme", this.theme);
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        setTimeout(() => {    
               this.changeTheme(this.theme);
        });
    }

}

