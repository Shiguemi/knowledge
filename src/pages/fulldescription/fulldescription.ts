import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'full-description',
    templateUrl: 'fulldescription.html'
})

export class FullDescription {
    id: string;
    title: string;
    detailedDescription: string;
    imageUrl: string;
    wikipediaUrl: string;
    loading: Loading;
    types: any;
    description: string;

    constructor(public navCtrl: NavController,       
        private provider: KnowledgeProvider, 
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private storage: Storage) {
        if (this.navParams) {
            this.id = this.navParams.get('id');
        }
        if (this.id && this.id != '') {
            this.mySubscribe(this.provider.searchId(this.id), this.id);
        }
        this.loading = this.loadingCtrl.create({
            content: '<div id="loading">loading...</div>'
        });
        this.loading.present();
    }

    
    mySubscribe(observable: Observable<JSON>, id: string) {
        this.storage.get(id).then((response) => {
            console.log("Using cached response");
            this.updateResponse(response); // uses the cached search!
            })
        .catch((err) => {
            observable.subscribe((response) => {
                this.storage.set(id, response); // caches everything!
                this.updateResponse(response);
            });  
        });
    }

    updateResponse(response) {
        var resultArray = response['itemListElement'];
        resultArray.forEach(element => {
            var result = element['result'];
            console.log(result);
            if (!result['image']) {
                result['image'] = {};
                result['image']['contentUrl'] = "assets/imgs/noimage.png";
            }
            this.title = result['name'];
            if (!result['detailedDescription']) {
                result['detailedDescription'] = {};
                result['detailedDescription']['articleBody'] = "";
                result['detailedDescription']['url'] = "";
                result['detailedDescription']['contentUrl'] = "";
            }
            this.detailedDescription = result['detailedDescription']['articleBody'];
            this.description = result['description'];
            this.wikipediaUrl = result['detailedDescription']['url'];
            this.imageUrl = result['image']['contentUrl'];
            if (result['@type']) {
                this.types = result['@type'];
            }
        });
    }

    imageLoaded() {
        console.log("Image loaded!");
        if (this.loading) {
            this.loading.dismiss();
        }
    }

    close() {
        this.navCtrl.pop();
    }
}