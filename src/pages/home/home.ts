import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public storage : Storage,
    private geolocation: Geolocation
  ) {

    this.storage.get('uid').then((val)=>{
      alert("this is user"+val);
      this.geolocation.getCurrentPosition().then((resp) => {
         console.log(resp.coords);

          var location = {
            longitude: resp.coords.longitude,
            latitude : resp.coords.latitude 
          }
          
           firebase.database()
          .ref(`/userProfile/${val}/location`)
          .update(location).then(result => {
             console.log(result);
             alert("Location saved");
          })
          .catch(error => {
            alert("Database error : unable to login try again")
          }); 

      }).catch((error) => {
        alert("error"+error);
      });


    })

  }

  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this.storage.clear();
    this.navCtrl.setRoot('LoginPage');
  }
}
