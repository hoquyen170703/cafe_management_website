import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import {ForgottedPasswordComponent} from "../forgotted-password/forgotted-password.component";
import { LoginComponent } from '../login/login.component';
import { UserService } from '../service/user.service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private diaglog:MatDialog,
    private userService:UserService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.userService.checkToken().subscribe((response:any)=> {
      this.router.navigate(['cafe/dashboard'])
    }, (error:any) =>{
      console.log(error)
    })
  }

  handleSignUpAction() {
    const diaglogConfig = new MatDialogConfig();
    diaglogConfig.width = "550px"
    this.diaglog.open(SignupComponent, diaglogConfig)
  }

  handleForgotedPasswordAction() {
    const diaglogConfig = new MatDialogConfig();
    diaglogConfig.width = "550px"
    this.diaglog.open(ForgottedPasswordComponent, diaglogConfig)
  }

  handleLoginAction() {
    const diaglogConfig = new MatDialogConfig();
    diaglogConfig.width = "550px"
    this.diaglog.open(LoginComponent, diaglogConfig)
  }

}
