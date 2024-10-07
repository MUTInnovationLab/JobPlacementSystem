import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  email:any;
  password:any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regular expression for email validation
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // regular expression for password validation
  userData: any;

  constructor( private db: AngularFirestore,private loadingController: LoadingController,
     navCtrl: NavController,private auth: AngularFireAuth,private navController: NavController,
     private toastController: ToastController) { }

  ngOnInit() {
    this.loadBotpress();
  }

//chatbot code
  isChatbotOpen = false;

        
  loadBotpress() {
    // Load the Botpress inject script dynamically
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    injectScript.async = true;
    document.head.appendChild(injectScript);

    // Load the Botpress configuration script dynamically
    const configScript = document.createElement('script');
    configScript.src = 'https://mediafiles.botpress.cloud/9650ceea-233c-474d-ab57-0208c18b7e29/webchat/config.js';
    configScript.defer = true;
    document.head.appendChild(configScript);

  }

  showBotpress() {
    (window as any).botpressWebChat.init({
      hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
      botId: '9650ceea-233c-474d-ab57-0208c18b7e29',
      botName: 'Support Bot',
      enableReset: true,
      enableTranscriptDownload: true,
      showPoweredBy: false,
    });
  }


  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  goToPage() {
    this.navController.navigateForward("/reset-p");
  }
  signUp(){

    this.navController.navigateForward("/create");
  
  }
  goToSignUp(){

    this.navController.navigateForward("/register");
  
  }

  async validate() {
    // Validate input
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Please enter your email.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // Validate email format
    if (!this.emailRegex.test(this.email)) {
      const toast = await this.toastController.create({
        message: 'Please provide a valid email address.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // Validate password format
    if (!this.password) {
      const toast = await this.toastController.create({
        message: 'Please enter your password.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    if (!this.passwordRegex.test(this.password)) {
      const toast = await this.toastController.create({
        message: 'Password must contain at least 8 characters including uppercase, lowercase, and numbers.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // If all validations pass, continue with sign-in logic
    this.log();
  }

  async log() {
    const loader = await this.loadingController.create({
      message: 'Signing in',
      cssClass: 'custom-loader-class'
    });
  
    try {
      await loader.present();
  
      const userCred = await this.auth.signInWithEmailAndPassword(this.email, this.password);
  
      if (userCred) {
        const studentQuerySnapshot = await this.db.collection('studentProfile')
          .ref.where('email', '==', this.email)
          .get();
  
        studentQuerySnapshot.forEach((doc: any) => {
          const id = doc.id;
          const userData = doc.data();
          const loginCount = userData.loginCount || 0;
          const newLoginCount = loginCount + 1;
  
          this.db.collection("studentProfile").doc(id).update({ loginCount: newLoginCount });
        });
  
        const registeredStudentQuerySnapshot = await this.db.collection("registeredStudents")
          .ref.where("email", "==", this.email.trim())
          .get();
  
        const registeredStaffQuerySnapshot = await this.db.collection("registeredStaff")
          .ref.where("email", "==", this.email.trim())
          .get();
  
        if (!registeredStudentQuerySnapshot.empty) {
          loader.dismiss();
          this.navController.navigateForward("/view");
        } else if (!registeredStaffQuerySnapshot.empty) {
          loader.dismiss();
          this.navController.navigateForward("/menu");
        } else {
          loader.dismiss();
          alert("User not found in registeredStudents or registeredStaff collections.");
        }
      }
    } catch (error) {
      loader.dismiss();
      const errorMessage = (error as Error).message;
  
      if (errorMessage === "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)." ||
          errorMessage === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).") {
        alert("Invalid email or password");
      } else if (errorMessage === "Firebase: The email address is badly formatted. (auth/invalid-email).") {
        alert("Incorrectly formatted email");
      }
    }
  }

}
