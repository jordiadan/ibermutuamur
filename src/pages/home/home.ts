import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import * as ciscospark from 'ciscospark';
import {AndroidPermissions} from "@ionic-native/android-permissions";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private spark;
  private access_token = "NWM0Njk4ZmEtZjEyMC00YzIzLWE2NDAtMmQwMWQxM2VlOTFmZTJkYzlmNjEtYWFh";

  constructor(public navCtrl: NavController, private androidPermissions: AndroidPermissions) {

  }

  checkPermissions(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => alert('Has permission? ' + result.hasPermission),
      err => this.requestCameraPermissions()
    );
  }


  requestCameraPermissions(){
    alert('Need persmission...');
    let permissions = [
      this.androidPermissions.PERMISSION.CAMERA
    ];

    this.androidPermissions.requestPermissions(permissions).then(
      result => alert('Permission granted? ' + result),
      err => alert('Cannot request permissions...')
    );
  }

  // try to use only connect_and_register with the permissions granted on the Application
  connect() {
    alert("Connecting...");
    //this.test_promise()
    //this.connect_and_register()
    this.checkPermissions()
  }

  test_promise(){
    var test = new Promise(function(){});
    test.constructor = Object;
    Promise.resolve(test);
  }

  connect_and_register(){
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
          access_token: this.access_token
        }
      });
    }

    if (!this.spark.phone.registered) {
      // we want to start listening for incoming calls *before* registering with
      // the cloud so that we can join any calls that may already be in progress.
      // this.spark.phone.on('call:incoming', (call) => {
      //   Promise.resolve()
      //     .then(() => {
      //       // Let's render the name of the person calling us. Note that calls
      //       // from external sources (some SIP URIs, PSTN numbers, etc) may not
      //       // have personIds, so we can't assume that field will exist.
      //       if (call.from && call.from.personId) {
      //         // In production, you'll want to cache this so you don't have to do
      //         // a fetch on every incoming call.
      //         return this.spark.people.get(call.from.personId);
      //       }
      //
      //       return Promise.resolve();
      //     })
      //     .then((person) => {
      //       const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';
      //       if (confirm(str)) {
      //         call.answer();
      //         //this.bindCallEvents(call);
      //       }
      //       else {
      //         call.decline();
      //       }
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //       alert(err);
      //     });
      // });
      alert('trying to connect...');
      return this.spark.phone.register()
        .then(() => {
          // This is just a little helper for our selenium tests and doesn't
          // really matter for the example
          document.body.classList.add('listening');
          console.log('connected');
          //document.getElementById('connection-status').innerHTML = 'connected';
          alert('calling jordi...');
          this.spark.phone.dial('jadan@makenai.es');
        })
        // This is a terrible way to handle errors, but anything more specific is
        // going to depend a lot on your app
        .catch((err) => {
          console.error(err);
          alert(err.stack);
          // we'll rethrow here since we didn't really *handle* the error, we just
          // reported it
          throw err;
        });
    }

    return Promise.resolve();
  }
}
