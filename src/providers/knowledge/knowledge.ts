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

  constructor(public http: HttpClient) {
    console.log('Hello KnowledgeProvider Provider');
  }

  public search(term: string): Observable<JSON> {
    var params = new HttpParams()
      .set('query', term)
      .set('limit', '10')
      .set('indent', 'true')
      .set('key', '<API_KEY>');
    return this.searchAll(params);
  }

  public searchId(id: string): Observable<JSON> {
    var params = new HttpParams()
      .set('ids', id)
      .set('limit', '10')
      .set('indent', 'true')
      .set('key', '<API_KEY>');
    return this.searchAll(params);
  }

  public searchAll(params: HttpParams): Observable<JSON> {
    var service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
    var httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'}),
      params: params
    };
    return this.http.get(service_url, httpOptions);
  }

}
