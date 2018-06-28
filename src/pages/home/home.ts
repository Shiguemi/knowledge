import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { JSONP_ERR_WRONG_RESPONSE_TYPE } from '@angular/common/http/src/jsonp';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  title: string;
  results: JSON;

  constructor(public navCtrl: NavController, private provider: KnowledgeProvider) {
    this.title = "Search using Google Knowledge Graph";
  }

  mySearch(term:string): void {
    this.mySubscribe(this.provider.search(term));
  }

  mySearchId(id:string): void {
    id = id.split(':')[1]
    this.mySubscribe(this.provider.searchId(id))
  }

  mySubscribe(observable: Observable<JSON>) {
    observable.subscribe((response) => {
      console.log(response);
      this.results = response['itemListElement'];
      var items = new Array(this.results);
      items.forEach(element => {
        var image = element['image'];
        console.log(image);
      });
    });
  }

}
