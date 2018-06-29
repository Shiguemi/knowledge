import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { KnowledgeProvider } from '../../providers/knowledge/knowledge';
import { Observable } from 'rxjs/Observable';

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

    constructor(public navCtrl: NavController,       
        private provider: KnowledgeProvider, 
        private navParams: NavParams) {
        if (this.navParams) {
            this.id = this.navParams.get('id');
        }
        if (this.id && this.id != '') {
            this.mySubscribe(this.provider.searchId(this.id));
        }
    }

    mySubscribe(observable: Observable<JSON>) {
        observable.subscribe((response) => {
            console.log(response);
            var resultArray = response['itemListElement'];
            resultArray.forEach(element => {
                var result = element['result'];
                console.log(result);
                if (!result['image']) {
                    result['image'] = {};
                    result['image']['contentUrl'] = "assets/imgs/logo.png";
                }
                this.title = result['name'];
                if (!result['detailedDescription']) {
                    result['detailedDescription'] = {};
                    result['detailedDescription']['articleBody'] = "";
                    result['detailedDescription']['url'] = "";
                    result['detailedDescription']['contentUrl'] = "";
                }
                this.detailedDescription = result['detailedDescription']['articleBody'];
                this.wikipediaUrl = result['detailedDescription']['url'];
                this.imageUrl = result['image']['contentUrl'];
            });
        });
    }

    close() {
        this.navCtrl.pop();
    }
}