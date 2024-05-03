import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UserService } from '../service/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../service/snackbar.service';
import { GlobalConstaints } from '../shared/global-constains';
import { emit } from 'process';

@Component({
  selector: 'app-forgotted-password',
  templateUrl: './forgotted-password.component.html',
  styleUrls: ['./forgotted-password.component.scss']
})
export class ForgottedPasswordComponent implements OnInit {
  forgotPasswordForm:any = FormGroup;
  resposeMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ForgottedPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstaints.emailRegex)]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }
    this.userService.forgotedPassword(data).subscribe((respose:any)=> {
      this.ngxService.stop()
      this.resposeMessage =respose?.message
      this.dialogRef.close()
      this.snackbarService.openSnackBar(this.resposeMessage,"")
    }, (error) => {
      this.ngxService.stop()
      if(error.error?.message) {
        this.resposeMessage = error.error?.message
      }
      else {
        this.resposeMessage = GlobalConstaints.genericError;
      }
      this.snackbarService.openSnackBar(this.resposeMessage, GlobalConstaints.error)
    });
    
  }

}
