import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { Observable } from 'rxjs/Observable';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
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

  constructor(public navCtrl: NavController, 
      private provider: KnowledgeProvider, 
      private navParams: NavParams,
      private nativePageTransitions: NativePageTransitions,
      private storage: Storage) {
      // private nativePageTransitions: NativePageTransitions) {
    this.title = "Google's Knowledge Graph";
    this.alertIsShown = false;
    if (this.navParams) {
      this.searchTerm = this.navParams.get('term');
    }
    if (this.searchTerm && this.searchTerm != '') {
      this.mySubscribe(this.provider.search(this.searchTerm), this.searchTerm);
    } else {
      this.searchTerm = "Type to search... swipe to next search...";
    }
  }

  mySearch(term:string): void {
    this.mySubscribe(this.provider.search(term), term);
  }

  mySearchNew(term: string): void {
    this.navCtrl.push(HomePage, {'term': term});
  }

  mySearchId(id:string): void {
    id = id.split(':')[1]
    this.mySubscribe(this.provider.searchId(id), id);
  }

  fullDescription(id: string): void {
    id = id.split(':')[1]
    this.navCtrl.push(FullDescription, {'id': id});
  }

  mySubscribe(observable: Observable<JSON>, term: string) {
    this.storage.get(term).then((response) => {
      console.log("Using cached response");
      this.updateResponse(response); // uses the cached search!
    })
    .catch((err) => {
      observable.subscribe((response) => {
        this.storage.set(term, response); // caches everything!
        this.updateResponse(response);
      });  
    });
  }

  updateResponse(response) {
    this.results = response['itemListElement'];
    var resultArray = response['itemListElement'];
    resultArray.forEach(element => {
      var result = element['result'];
      if (!result['image']) {
        result['image'] = {};
        result['image']['contentUrl'] = "assets/imgs/logo.png";
      }
    });
  }

  userSwipe(event, term) {
    console.log("event: " + event.offsetDirection);
    console.log("term: " + term);
    if (event.offsetDirection == 2) {
      this.navCtrl.push(HomePage, {'term': term });
      this.transitionDirection = 'left';
    }
    if (event.offsetDirection == 4) {
      this.transitionDirection = 'right';
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      }
    }
  }

  // ionViewWillLeave() {

  //   let options: NativeTransitionOptions = {
  //      direction: this.transitionDirection,
  //      duration: 500,
  //      slowdownfactor: 3,
  //      slidePixels: 20,
  //      iosdelay: 100,
  //      androiddelay: 150,
  //      fixedPixelsTop: 0,
  //      fixedPixelsBottom: 60
  //     };
   
  //   this.nativePageTransitions.slide(options);
  //     //.then(onSuccess)
  //     //.catch(onError);
   
  //  }

}
