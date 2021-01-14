import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AlertController,NavController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-phone-auth-sign-in',
  templateUrl: './phone-auth-sign-in.page.html',
  styleUrls: ['./phone-auth-sign-in.page.scss'],
})
export class PhoneAuthSignInPage implements OnInit {
  phoneNumber;
  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: FirestoreService,
    private router:Router
  ) { }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier("recaptcha-container");
  }
  async signIn(){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + this.phoneNumber;
    firebase.default.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
    .then(async (confirmationResult) => {
      
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let prompt = await this.alertController.create({
          header: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            {
              text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            {
              text: 'Send',
              handler: async (data) => {
                const loading = await this.loadingController.create();
                await loading.present();
                confirmationResult.confirm(data.confirmationCode)
                  .then(result => {
                    loading.dismiss();
                    // this.router.navigate(['chat']);
                    this.router.navigateByUrl('/messages', { replaceUrl: true });
                   
                  }).catch(async (error) => {
                    loading.dismiss();
                    const alert = await this.alertController.create({
                      header: 'Please Try Again',
                      message: error.message,
                      buttons: ['OK'],
                    });
                    await alert.present();
                  })
              }
            }
          ]
        });
        await prompt.present();
      })
  }
}
