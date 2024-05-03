import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../service/snackbar.service';
import { GlobalConstaints } from '../shared/global-constains';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage:any;
	data:any;
	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackbarService:SnackbarService
	) {
		this.ngxService.start();
		this.dashboardData();
	}

	dashboardData() {
		this.dashboardService.getDetails().subscribe((response:any) =>{
			this.ngxService.stop();
			this.data = response;
		},(error) =>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessage = error.error?.message;
			}
			else {
				this.responseMessage = GlobalConstaints.genericError;
			}
			this.snackbarService.openSnackBar(this.responseMessage, GlobalConstaints.error)
		})
	}

}
