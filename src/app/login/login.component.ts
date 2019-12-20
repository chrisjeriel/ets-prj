import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService, UserService } from '@app/_services';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';


@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    images = [4].map((n) => `app/resources/images/${n}.gif`);
    /*, 965, 982, 1043, 738*/

      paused = false;
      unpauseOnArrow = false;
      pauseOnIndicator = false;
      pauseOnHover = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    @ViewChild('carousel', {}) carousel: NgbCarousel;

      togglePaused() {
        if (this.paused) {
          this.carousel.cycle();
        } else {
          this.carousel.pause();
        }
        this.paused = !this.paused;
      }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value.toUpperCase(), this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {

                    this.userService.userLogin(this.f.username.value.toUpperCase(), this.f.password.value).subscribe(data => {        
          
                        // this.userService.setAccessModules(data['modulesList']);
                        this.userService.emitAccessModules(data['modulesList']);

                    });

                    this.router.navigate([this.returnUrl]).then(() => {
                        window.location.reload();
                    });

                    
                },
                error => {
                    console.log("ERROR:::" + JSON.stringify(error));
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
    }
}
