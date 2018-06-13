import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';
// import firebase from 'firebase/app';
import { Storage } from '@ionic/storage';






import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder,
    public storage : Storage
  ) {
    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }
  
  facebookLogin(): void {
    this.authProvider.facebookLogin() .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);
          
         // alert(JSON.stringify(facebookCredential));

       try {

         

      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => { 
          // alert("new")
          // alert(JSON.stringify(success));
          this.storage.set('uid', success.uid);
            firebase
          .database()
          .ref(`/userProfile/${success.uid}`)
          .set({
            location: "", 
            data: success.providerData

          }).then(result => {
             this.navCtrl.setRoot(HomePage);
          })
          .catch(error => {
            alert("Database error : unable to login try again")
          });
          
        });

      } catch(error){
        alert(error);
      }  

    }).catch((error) => { alert(error) });
  }


  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }

  async loginUser(): Promise<void> {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const loading: Loading = this.loadingCtrl.create();
      loading.present();

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      try {
        const loginUser: firebase.User = await this.authProvider.loginUser(
          email,
          password
        );
        console.log(loginUser);
        this.storage.set('uid', loginUser.uid);
        await loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }
    }
  }
}

