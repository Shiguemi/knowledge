import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  title: string;
  results: JSON;
  myResults: Array<any> = [{}];
  searchTerm: string;
  panIsRunning: boolean;
  alertIsShown: boolean;

  constructor(public navCtrl: NavController, 
      private provider: KnowledgeProvider, 
      private navParams: NavParams,
      private alertCtrl: AlertController) {
    this.title = "Google's Knowledge Graph";
    this.panIsRunning = false;
    this.alertIsShown = false;
    if (this.navParams) {
      this.searchTerm = this.navParams.get('term');
    }
    if (this.searchTerm && this.searchTerm != '') {
      this.mySubscribe(this.provider.search(this.searchTerm));
    } else {
      this.searchTerm = "Type to search...";
    }
  }

  mySearch(term:string): void {
    this.mySubscribe(this.provider.search(term));
  }

  mySearchNew(term: string): void {
    this.navCtrl.push(HomePage, {'term': term});
  }

  mySearchId(id:string): void {
    id = id.split(':')[1]
    this.mySubscribe(this.provider.searchId(id))
  }

  mySubscribe(observable: Observable<JSON>) {
    observable.subscribe((response) => {
      console.log(response);
      this.results = response['itemListElement'];
      var resultArray = response['itemListElement'];
      resultArray.forEach(element => {
        var result = element['result'];
        console.log(result);
        if (!result['image']) {
          result['image'] = {};
          result['image']['contentUrl'] = "assets/imgs/logo.png";
        }
      });
    });
  }

  userPan(event, term, delay) {
    if (event.additionalEvent == "panright") {
      this.navCtrl.push(HomePage, {'term': term });
    }
    if (event.additionalEvent == "panleft") {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      } else if (!this.alertIsShown) {
        this.alertIsShown = true;
        const alert = this.alertCtrl.create({
          title: 'Sorry!',
          subTitle: 'You are at the beginning of this search.',
          buttons: ['OK']
        });
        setTimeout(function() {
          this.alertIsShown = false;
          this.panIsRunning = false;
        }, delay);
        alert.present();
      }
    }
  }

  userPanDebounce(event, term, delay) {
    console.log("event: " + event.additionalEvent);
    console.log("term: " + term);
    console.log("running: " + this.panIsRunning);
    if (!this.panIsRunning) {
      this.userPan(event, term, delay);
      this.panIsRunning = true;
      setTimeout(function() {
        this.panIsRunning = false;
      }, delay);
    }
  }

  ionViewDidEnter() {
    this.panIsRunning = false;
  }

}
