import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/service/bill.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { GlobalConstaints } from 'src/app/shared/global-constains';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email','contactNumber','paymentMethod','total','view'];
  dataSource:any;
  responseMessage:any;

  constructor(private billService:BillService,
    private ngxService:NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService:SnackbarService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.billService.getBills().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response)
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstaints.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstaints.error)
    
    })
  }
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleViewAction(value:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data:value
    }
    dialogConfig.width = "100%"
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
  }
  handleDeleteAction(value:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete'+value.name+ 'bill',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
      this.ngxService.start();
      this.deleteBill(value.id)
      dialogRef.close();
    })
  }

  deleteBill(id:any){
    this.billService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop()
      this.tableData()
      this.responseMessage= response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success")

    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstaints.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstaints.error)
    
    })
  }
  downloadReportAction(value:any){
    this.ngxService.start()
    var data = {
      name: value.name,
      email: value.email,
      uuid: value.uuid,
      contactNumber: value.contactNumber,
      paymentMethod: value.paymentMethod,
      totalAmount: value.totalAmount,
      productDetails: value.productDetail
    }
    this.dowloadFile(value.uuid,data);
  }
  dowloadFile(fileName:string,data:any){
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,`${fileName}.pdf`);
      this.ngxService.stop();
    })

  }
}
