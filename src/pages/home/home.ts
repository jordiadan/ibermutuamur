import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';

import * as ciscospark from 'ciscospark';
//import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Camera, CameraOptions} from "@ionic-native/camera";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private image: string = null;
  private spark;
  private access_token = "MDNmMjQwMTktZjA2Ni00NTY5LWJiN2YtZTM1NjM3ODgxYjhmYTA2MTllYTgtZjU4";

  @ViewChild('selfView') selfView: ElementRef;
  @ViewChild('remoteViewAudio') remoteViewAudio: ElementRef;
  @ViewChild('remoteViewVideo') remoteViewVideo: ElementRef;
  constructor(
    public plt: Platform,
    public navCtrl: NavController,
    /*private androidPermissions: AndroidPermissions,
    private camera: Camera*/) {
  }

  checkDevice() {
    console.log('Android: ' + this.plt.is('android'));
    console.log('iOS: ' + this.plt.is('ios'));
    console.log('mobileweb: ' + this.plt.is('mobileweb'));
    console.log('cordova: ' + this.plt.is('cordova'));
  }

  // checkPermissions() {
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
  //     result => alert('Has permission? ' + result.hasPermission),
  //     err => this.requestCameraPermissions()
  //   );
  // }
  //
  //
  // requestCameraPermissions() {
  //   alert('Need persmission...');
  //   let permissions = [
  //     this.androidPermissions.PERMISSION.CAMERA,
  //     this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
  //     this.androidPermissions.PERMISSION.RECORD_AUDIO,
  //   ];
  //
  //   this.androidPermissions.requestPermissions(permissions).then(
  //     result => alert('Permission granted? ' + result),
  //     err => alert('Cannot request permissions...' + err)
  //   );
  // }

  // try to use only connect_and_register with the permissions granted on the Application
  connect() {
    alert("Connecting...");
    this.connect_and_register()
    //this.checkPermissions()
    //this.getPicture();
  }

  connect_and_register() {
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

          const call = this.spark.phone.dial('jadan@makenai.es');
          this.bindCallEvents(call);
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

  bindCallEvents(call) {
    // call is a call instance, not a promise, so to know if things break,
    // we'll need to listen for the error event. Again, this is a rather naive
    // handler.
    call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    // We can start rendering local and remote video before the call is
    // officially connected but not right when it's dialed, so we'll need to
    // listen for the streams to become available. We'll use `.once` instead
    // of `.on` because those streams will not change for the duration of
    // the call and it's one less event handler to worry about later.

    call.once('localMediaStream:change', () => {
      //document.getElementById('selfView').srcObject = call.localMediaStream;
      this.selfView.nativeElement.srcObject = call.localMediaStream;
    });

    call.on('remoteMediaStream:change', () => {
      // Ok, yea, this is a little weird. There's a Chrome behavior that prevents
      // audio from playing from a video tag if there is no corresponding video
      // track.
      [
        'audio',
        'video'
      ].forEach((kind) => {
        if (call.remoteMediaStream) {
          const track = call.remoteMediaStream.getTracks().find((t) => t.kind === kind);
          if (track) {
            if(kind === 'audio') {
              console.log('Creating AUDIO MediaStream');
              this.remoteViewAudio.nativeElement.srcObject =  new MediaStream([track]);
            } else if (kind === 'video') {
              console.log('Creating VIDEO MediaStream');
              this.remoteViewVideo.nativeElement.srcObject =  new MediaStream([track]);
            }
            //document.getElementById(`remote-view-${kind}`).srcObject = new MediaStream([track]);
          }
        }
      });
    });

    // Once the call ends, we'll want to clean up our UI a bit
    call.on('inactive', () => {
      // Remove the streams from the UI elements
      //document.getElementById('selfView').srcObject = undefined;
      //document.getElementById('remoteViewAudio').srcObject = undefined;
      //document.getElementById('remoteViewVideo').srcObject = undefined;

      this.selfView.nativeElement.srcObject = undefined;
      this.remoteViewAudio.nativeElement.srcObject = undefined;
      this.remoteViewVideo.nativeElement.srcObject = undefined;
    });


  }
}
