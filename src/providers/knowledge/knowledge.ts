import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the KnowledgeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class KnowledgeProvider {

  searchTypes(term: string, types: Array<string>): Observable<any> {
    var params = this.buildHttpParams()
      .set('query', term);
    var count = 0;
    types.forEach(element => {
      if (count == 0) {
        params = params.set('types', element);
      } else {
        params = params.append('types', element);
      }
      count++;
    });
    console.log("Params: " + params.toString());
    return this.searchAll(params)
  }

  constructor(public http: HttpClient) {
    console.log('Hello KnowledgeProvider Provider');
  }

  public search(term: string): Observable<any> {
    return this.searchAll(
      this.buildHttpParams().set('query', term));
  }

  public searchId(id: string): Observable<any> {
    return this.searchAll(
      this.buildHttpParams().set('ids', id));
  }

  public searchAll(params: HttpParams): Observable<any> {
    var service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
    var httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      params: params
    };
    return this.http.get(service_url, httpOptions);
  }

  public buildHttpParams(): HttpParams {
    return new HttpParams()
    .set('limit', '10')
    .set('indent', 'true')
    .set('languages', 'en')
    .set('key', 'AIzaSyB8Ycbavt2DwYtAr5ncWIzeN6hxAJCrAmw');
}
}
