import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { emit } from 'process';
import { BillService } from 'src/app/service/bill.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { GlobalConstaints } from 'src/app/shared/global-constains';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColums: String[] = ['name', 'category', 'price', 'quantity', 'total', 'edit']
  dataSource:any = [];
  manageOrderForm:any = FormGroup
  categorys:any = [];
  products:any = [];
  price:any;
  totalAmount:number = 0;
  responseMessage:any;



  constructor(private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private productService:ProductService,
    private snackbarService : SnackbarService,
    private billService : BillService,
    private ngxService : NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.getCategory()
    this.manageOrderForm = this.formBuilder.group(
      {
        name:[null,[Validators.required,Validators.pattern(GlobalConstaints.nameRegex)]],
        email: [null,[Validators.required,Validators.pattern(GlobalConstaints.emailRegex)]],
        contactNumber: [null,[Validators.required,Validators.pattern(GlobalConstaints.contactNumberRegex)]],
        paymentMethod: [null,[Validators.required]],
        product: [null,[Validators.required]],
        category:[null,[Validators.required]],
        quantity:[null,[Validators.required]],
        price:[null,[Validators.required]],
        total:[null,[Validators.required]]
      }
    )
  }

  getCategory(){
    this.categoryService.getFilteredCategorys().subscribe((response:any)=> {
      this.ngxService.stop()
      this.categorys = response
    },(error:any)=>{
      console.log(error.error?.message);
      if(error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstaints.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstaints.error)
    });
  }

  getProductsByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue('0');
    }, (error: any) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstaints.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstaints.error);
    });
  }

  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
      this.price = response[0].price
      
      this.manageOrderForm.controls['price'].setValue(response[0].price.toString());
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue((this.price*1).toString());
    },(error:any) => {
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
    setQuantity(value:any){
      var temp = this.manageOrderForm.controls['quantity'].value;
      if(temp > 0){
        this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
      }
      else if(temp != ''){
        this.manageOrderForm.controls['quantity'].setValue('1');
      }this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    }

    validateProductAdd(){
      if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null 
        || this.manageOrderForm.controls['quantity'].value <= 0
      ){
        return true;
      } else 
      return false;
    }

    validateSubmit(){
      if(this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null ||this.manageOrderForm.controls['paymentMethod'].value === null){
            return true;
        }
        else 
        return false;
    }

    add(){
      var formData = this.manageOrderForm.value;
      var productName = this.dataSource.find((e: {id:number}) => e.id === formData.product.id);
      if(productName === undefined){
        this.totalAmount = this.totalAmount + formData.total;
        this.dataSource.push({id: formData.product.id, name: formData.product.name, category: formData.category.name, quantity: formData.quantity, price: formData.price, total: formData.total});
        this.dataSource = [...this.dataSource]
        this.snackbarService.openSnackBar(GlobalConstaints.productAdded,"success");
      } 
      else {
        this.snackbarService.openSnackBar(GlobalConstaints.productExistError,GlobalConstaints.error);
      }
    }

    handleDeleteAction(value:any, element:any){
      this.totalAmount = this.totalAmount - element.total;
      this.dataSource.splice(value,1);
      this.dataSource = [...this.dataSource]
    }

    submitAction(){
      
      var formData = this.manageOrderForm.value;
      var data = {
        name : formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        paymentMethod: formData.paymentMethod,
        totalAmount: this.totalAmount.toString(),
        productDetails: JSON.stringify(this.dataSource)
      } 
      this.ngxService.start();
      this.billService.generateReport(data).subscribe((response:any)=>{
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource=[];
        this.totalAmount = 0;

      },(error:any) => {
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
    downloadFile(fileName: string){
      var data = {
        uuid: fileName
      }
      this.billService.getPdf(data).subscribe((response:any)=>{
        saveAs(response,fileName+ '.pdf')
        this.ngxService.stop()
      })
    }
}
