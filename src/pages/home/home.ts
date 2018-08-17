import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { Observable } from 'rxjs/Observable';
import { FullDescription } from '../fulldescription/fulldescription';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  title: string;
  results: JSON;
  myResults: Array<any> = [{}];
  searchTerm: string;
  alertIsShown: boolean;
  transitionDirection: string;
  @ViewChild('inputSearch') inputSearch;
  itemsLoaded: number = 0;
  itemsTotal: number;
  loading: Loading;
  searchSequence: number = 0;
  lastSearch: number = 0;
  types: Array<string> = [];
  selectedtypes: Array<string> = [];

  constructor(public navCtrl: NavController, 
      private provider: KnowledgeProvider, 
      private navParams: NavParams,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      private storage: Storage) {
    this.title = "Google's Knowledge Graph";
    this.alertIsShown = false;
    this.storage.clear();
    this.loading = this.loadingCtrl.create({
      content: 'loading...'
    });
    if (this.navParams) {
      this.searchTerm = this.navParams.get('term');
    }
    if (this.searchTerm && this.searchTerm != '') {
      this.searchSequence++;
      this.mySubscribe(this.provider.search(this.searchTerm), this.searchTerm, this.searchSequence);
    } else {
      this.searchTerm = "Type to search... swipe to next search...";
    }
}

  mySearch(term:string): void {
    this.searchSequence++;
    this.mySubscribe(this.provider.search(term), term, this.searchSequence);
  }

  mySearchNew(term: string): void {
    this.navCtrl.push(HomePage, {'term': term});
  }

  mySearchId(id:string): void {
    id = id.split(':')[1]
    this.searchSequence++;
    this.mySubscribe(this.provider.searchId(id), id, this.searchSequence);
  }

  typeSelect(type: string) {
    var button = document.getElementById(type) as HTMLElement;
    var index = this.selectedtypes.indexOf(type);
    if (index == -1) {
      this.selectedtypes.push(type);
      button.color = "gray";
    } else {
      this.selectedtypes.splice(index, 1);
      button.color = "default";
    }
  }

  fullDescription(id: string): void {
    id = id.split(':')[1]
    this.navCtrl.push(FullDescription, {'id': id});
  }

  mySubscribe(observable: Observable<JSON>, term: string, searchSequence: number) {
    var spinner = document.getElementById("spinner") as HTMLElement;
    spinner.innerHTML = '<ion-spinner name="dots"></ion-spinner>';
    this.itemsLoaded = 0;
    this.storage.get(term).then((response) => {
      if (response != null) {
      console.log("Using cached response");
        if (searchSequence > this.lastSearch) {
      this.updateResponse(response); // uses the cached search!
          this.lastSearch = searchSequence;
        }  
      } else {
        this.doNewSearch(observable, term, searchSequence);
      }
    })
    .catch((err) => {
      this.doNewSearch(observable, term, searchSequence);
    });
  }

  doNewSearch(observable: Observable<JSON>, term: string, searchSequence: number): void {
      observable.subscribe((response) => {
      if (response['itemListElement'].length > 0) {
        this.storage.set(term, response); // caches only not empty responses
      }
      if (searchSequence > this.lastSearch) {
        this.updateResponse(response);
        this.lastSearch = searchSequence;
      }
    });
  }

  updateResponse(response) {
    this.results = response['itemListElement'];
    var resultArray = response['itemListElement'];
    this.itemsTotal = resultArray.length;
    resultArray.forEach(element => {
      var result = element['result'];
      if (!result['image']) {
        result['image'] = {};
        result['image']['contentUrl'] = "assets/imgs/logo.png";
      }
      if (result['@type']) {
        result['@type'].forEach(element => {
          if (this.types.indexOf(element) == -1) {
            this.types.push(element);
          }
        })
      }
    });
  }

  userSwipe(event, title, description) {
    console.log("term: " + title);
    if (event.offsetDirection == 2) {
      var toSearch = "";
      if (title && title.length != 0) {
        toSearch = title;
      } else {
        toSearch = description;
      }
      if (toSearch === this.searchTerm) {
        this.showAlert('Same search:', toSearch);
        return;
      }
      this.navCtrl.push(HomePage, {'term': toSearch});
      this.transitionDirection = 'left';
    }
    if (event.offsetDirection == 4) {
      this.transitionDirection = 'right';
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      }
    }
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.inputSearch.setFocus();
    }, 150); // at least 150ms
  }

  showAlert(alertTitle, alertTerm) {
    const alert = this.alertCtrl.create({
      title: alertTitle,
      subTitle: alertTerm,
      buttons: ['Ok']
    });
    alert.present();
  }

  loadCompleted() {
    this.itemsLoaded++;
    if (this.itemsLoaded == this.itemsTotal) {
      console.log("loadCompleted: " + this.itemsLoaded);
      var spinner = document.getElementById("spinner") as HTMLElement;
      spinner.innerHTML = "";
    }
  }

}
