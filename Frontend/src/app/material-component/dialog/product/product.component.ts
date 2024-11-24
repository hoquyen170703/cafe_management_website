import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { GlobalConstaints } from 'src/app/shared/global-constains';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter()
  productForm: any = FormGroup
  dialogAdction: any = "Add";
  action: any = "Add"

  responseMessage: any;
  categorys: any = []


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private ngxService:NgxUiLoaderService
  ) { }


  ngOnInit(): void {
    this.productForm = this.formBuilder.group(
      {
        name: [null,[Validators.required], Validators.pattern(GlobalConstaints.nameRegex)],
        categoryId: [null,[Validators.required]],
        price:[null,[Validators.required]],
        description: [null,[Validators.required]]
      }
    )
    if (this.dialogData.action === 'Edit') {
      this.dialogAdction = "Edit"
      this.action = "Update"
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }

  getCategorys(){
    this.categoryService.getCategory().subscribe((response)=>{
      this.categorys = response;

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
  handleSubmit(){
    if (this.dialogAdction === "Edit") {
      this.edit();
    } else {
      this.add()
    }
  }

  add(){
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close()
      this.onAddProduct.emit();
      this.responseMessage = response.message
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
    },(error:any)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage =error.error?.message
      }
      else{
        this.responseMessage = GlobalConstaints.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstaints.error)
    })
  }
  edit(){
    var formData = this.productForm.value;
    var data = {
      id:this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close()
      this.onEditProduct.emit();
      this.responseMessage = response.message
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
    },(error:any)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage =error.error?.message
      }
      else{
        this.responseMessage = GlobalConstaints.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstaints.error)
    })
  }
}
