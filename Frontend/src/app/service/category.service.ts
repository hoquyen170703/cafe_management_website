import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl

  constructor(private httpClient:HttpClient) { }

  add(data:any) {
    return this.httpClient.post(
      this.url+"/category/add", data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      }
    )
  }

  update(data:any) {
    return this.httpClient.post(
      this.url+"/category/update", data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      }
    )
  }

  delete(data:any, id:any) {
    return this.httpClient.post(
      this.url+`/category/delete/{$id}`, data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      }
    )
  }
  getCategory() {
    return this.httpClient.get(
      this.url+"/category/get");
    
  }
  getFilteredCategorys(){
    return this.httpClient.get(
      this.url+"/category/get?filterValue=true");
  }
}
