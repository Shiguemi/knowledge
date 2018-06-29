import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { Observable } from 'rxjs/Observable';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FullDescription } from '../fulldescription/fulldescription';

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
  transitionDirection: string;

  constructor(public navCtrl: NavController, 
      private provider: KnowledgeProvider, 
      private navParams: NavParams,
      private nativePageTransitions: NativePageTransitions) {
      // private nativePageTransitions: NativePageTransitions) {
    this.title = "Google's Knowledge Graph";
    this.panIsRunning = false;
    this.alertIsShown = false;
    if (this.navParams) {
      this.searchTerm = this.navParams.get('term');
    }
    if (this.searchTerm && this.searchTerm != '') {
      this.mySubscribe(this.provider.search(this.searchTerm));
    } else {
      this.searchTerm = "Type to search... swipe to next search...";
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

  fullDescription(id: string): void {
    id = id.split(':')[1]
    this.navCtrl.push(FullDescription, {'id': id});
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

  ionViewDidEnter() {
    this.panIsRunning = false;
  }

  ionViewWillLeave() {

    let options: NativeTransitionOptions = {
       direction: this.transitionDirection,
       duration: 500,
       slowdownfactor: 3,
       slidePixels: 20,
       iosdelay: 100,
       androiddelay: 150,
       fixedPixelsTop: 0,
       fixedPixelsBottom: 60
      };
   
    this.nativePageTransitions.slide(options);
      //.then(onSuccess)
      //.catch(onError);
   
   }

}
