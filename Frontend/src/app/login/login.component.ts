import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../service/snackbar.service';
import { Route, Router } from '@angular/router';
import { GlobalConstaints } from '../shared/global-constains';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm:any = FormBuilder;
  responseMessage:any
  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    public dialogRef:MatDialogRef<LoginComponent>,
    private ngxService:NgxUiLoaderService,
    private snackBarService:SnackbarService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstaints.emailRegex)]],
      password: [null, [Validators.required]],
      
    })

  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value
    var data = {
      email: formData.email,
      password: formData.password
     
    }
    this.userService.login(data).subscribe((response:any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token', response.token)
      this.router.navigate(['/cafe/dashboard'])
    }, (error) => {
      this.ngxService.stop()
      if(error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstaints.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstaints.error)
    });
  }
  

}
