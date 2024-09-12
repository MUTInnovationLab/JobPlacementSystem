import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {

  nameError :any;
  positionError :any;
  staffError : any;
  emailError: any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  name:any;
  email:any;
  position:any;
  staffNumber:any;

  userDocument:any;

  navController: NavController;

  
  role = {
    history: "off",
    statistic: "off",
    employment: "off",
    wil: "off",
    addUser:"off",
    validation:"off",
  };

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private db: AngularFirestore,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private navCtrl: NavController
  ) {
    this.navController = navCtrl;
  }

  goToAllUsers(){
    this.navController.navigateForward('/all-users');

  }
  goToView(): void {
    this.navController.navigateBack('/staffprofile');
  }
  handleMenuClick() {
    console.log('Menu button clicked');
  }
  isNavOpen: boolean = false;
  toggleNav() {
    console.log('menu');
    this.isNavOpen = !this.isNavOpen;
  }

  ngOnInit() {
    
  }

  // Getter functions to access form control values easily in the template
 

  getAdduserValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.addUser = toggleValue;
  }

  getHistoryValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.history = toggleValue;
  }

  getStatisticValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.statistic = toggleValue;
  }

  getEmploymentValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.employment = toggleValue;
  }

  getWilValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.wil = toggleValue;
    console.log(this.role);
  }
  getValidationValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.validation = toggleValue;
    console.log(this.role);
  }





  async Validation() {
 

    this.emailError = null;
    this.staffError = null;
    this.positionError = null;
    this.nameError = null;


   

    if (!this.name) {
      this.nameError = 'Please enter name.';
      alert("Please enter name");
      return;
    }



    if (!this.email) {
      this.emailError = 'Please enter email.';
      alert("Please enter email");
      return;
    }

    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email Address.';
      alert('please enter a valid Address.');
      return;
    }

    if (!this.position) {
      this.positionError = 'Please enter position.';
      alert('Please enter position.');
      return;
    }

    if (!this.staffNumber) {
      this.staffError = 'Please enter staff number.';
      alert('Please enter staff number.');
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Assigning',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
   
    this.auth.createUserWithEmailAndPassword(this.email, this.staffNumber)
    .then(userCredential => {
      if (userCredential.user) {
   
      this.db.collection('registeredStaff').add({
         Name:this.name,
         email:this.email,
         staffNumber:this.staffNumber,
         position:this.position,
         role:this.role
  
      
      }).then(() => {
        loader.dismiss();
        alert("Staff registered successfully");
        // Clear the field values
        this.name = '';
        this.email = '';
        this.position = '';
        this.staffNumber = ''; 
  
      }).catch((error:any) => {
        loader.dismiss();
        const errorMessage = error.message;
        alert(errorMessage);
      });
    } else {
      loader.dismiss();
      alert('User not found');
    }
  }).catch((error) => {
    loader.dismiss();
  });


  }








updateUser() {
  const email = this.email; // Get the email from the input field

  this.db.collection('registeredStaff').ref.where('email', '==', email).get()
    .then((querySnapshot) => {
      const typedSnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

      if (typedSnapshot.empty) {
        alert('User not found');
        return;
      }

      const documentId = typedSnapshot.docs[0].id;

      this.db.collection('registeredStaff').doc(documentId).update({
        Name: this.name,
        email: this.email,
        staffNumber: this.staffNumber,
        position: this.position,
        role: this.role
      })
      .then(() => {
        alert('User updated successfully');
      })
      .catch((error: any) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
    })
    .catch((error: any) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}



deleteUser() {
  const email = this.email; // Get the email from the input field

  this.db.collection('registeredStaff').ref.where('email', '==', email).get()
    .then((querySnapshot) => {
      const typedSnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

      if (typedSnapshot.empty) {
        alert('User not found');
        return;
      }

      const documentId = typedSnapshot.docs[0].id;

      this.db.collection('registeredStaff').doc(documentId).delete()
        .then(() => {
          alert('User deleted successfully');
        })
        .catch((error: any) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    })
    .catch((error: any) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}








//Previlages

ionViewDidEnter() {
  this.getUser();
}

async getUser(): Promise<void> {
  const user = await this.auth.currentUser;

  if (user) {
    try {
      const querySnapshot = await this.db
        .collection('registeredStaff')
        .ref.where('email', '==', user.email)
        .get();

      if (!querySnapshot.empty) {
        this.userDocument = querySnapshot.docs[0].data();
        console.log(this.userDocument);
      }
    } catch (error) {
      console.error('Error getting user document:', error);
    }
  }
}





async goToEmployment(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.employment === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/employment-page');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to Employment Page:', error);
  }
}


async goToValidator(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.validation === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/ga-validation');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to grade avaerage validator Page:', error);
  }
}

async goToHistory(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.history === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/history');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to History Page:', error);
  }
}

async  goToReports(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.statistic === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/reports');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to Reports Page:', error);
  }
}

async goToWil(): Promise<void> {

  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.wil === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/wil-page');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to WIL Page:', error);
  }
}


goToMenuPage(): void {
  this.navController.navigateForward('/menu').then(() => {
    window.location.reload();
  });
}

async presentConfirmationAlert() {
  const alert = await this.alertController.create({
    header: 'Confirmation',
    message: 'Are you sure you want to SIGN OUT?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
       cssClass: 'my-custom-alert',
        handler: () => {
          console.log('Confirmation canceled');
        }
      }, {
        text: 'Confirm',
        handler: () => {
         
          
          this.auth.signOut().then(() => {
            this.navController.navigateForward("/sign-in");
            this.presentToast()
      
      
          }).catch((error) => {
          
          });



        }
      }
    ]
  });
  await alert.present();
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'SIGNED OUT!',
    duration: 1500,
    position: 'top',
  
  });

  await toast.present();
}

goToHomePage(): void {
  this.navController.navigateBack('/home');
}


}
