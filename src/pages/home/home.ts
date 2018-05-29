import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as ciscospark from 'ciscospark';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private spark;

  constructor(public navCtrl: NavController) {

  }

  connect(){
    alert("Connecting...");
    if (!this.spark) {
      this.spark = ciscospark.init({
        config: {
          phone: {
            // Turn on group calling; there's a few minor breaking changes with
            // regards to how single-party calling works (hence, the opt-in), but
            // this is how things are going to work in 2.0 and if you plan on
            // doing any group calls, you'll need this turned on for your entire
            // app anyway.
            enableExperimentalGroupCallingSupport: true
          }
        },
        credentials: {
          access_token: "jkjkfdjfkdñajñda"/*this.access_token*/
        }
      });
    }
  }

}
