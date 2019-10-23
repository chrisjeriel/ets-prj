import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  	this.auth.logout();
  	this.router.navigate(['/login']);
  }

}
