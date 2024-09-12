import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-p',
  templateUrl: './reset-p.page.html',
  styleUrls: ['./reset-p.page.scss'],
})
export class ResetPPage implements OnInit {

  email:any;
  emailError:any;
  constructor(private auth:AngularFireAuth,private navController: NavController) { }

  ngOnInit() {
  }

  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  reset(){
   
   
    this.auth.sendPasswordResetEmail(this.email)
    .then(userCredential => {
  
      window.alert("Email sent with link to reset your password");
     
      this.navController.navigateForward("/sign-in");


      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert("please enter a valid email");

      // ..
    });
  }

  goToPage() {
    this.navController.navigateForward("/sign-in");
  }


}
