import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import { Facebook } from '@ionic-native/facebook'
import { Storage } from '@ionic/storage';



@Injectable()
export class AuthProvider {
  constructor(public facebook: Facebook,public storage : Storage) {}

  loginUser(email: string, password: string): Promise<User> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async signupUser(email: string, password: string): Promise<User> {
    try {
      const newUser: User = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

        var data = {
          email : email,
          uid  : newUser.uid
        }

      await firebase
        .database()
        .ref(`/userProfile/${newUser.uid}`)
        .set({
           location: "",
           data: data
        });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }


  facebookLogin(): Promise<any> {
  return this.facebook.login(['email'])
   
   }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
}
