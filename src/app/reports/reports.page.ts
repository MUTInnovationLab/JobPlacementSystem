import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  userDocument:any;

  coursedata : any[]=[];
  course :any[]=[];
  subCourses:any;
  faculty="";
  selectedOption:any;
  selectedSubOption:any;
  showSecondDropdownFlag: boolean = false;
  location:any;
  city:any[]=[];
  cities: any[]=[];
  userCount: any;
  count:any;
  placed:any;



  constructor(private navController: NavController,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private fStorage: AngularFireStorage,
    private db: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController) 
    
    {
      
    }

  ngOnInit() {

    this.getCities();
    this.getUserCount();
    this.getRecommendedCounts();
    this.getPlacedCounts();
  }
 
  isNavOpen: boolean = false;
  toggleNav() {
    console.log('menu');
    this.isNavOpen = !this.isNavOpen;
  }

  goToPage() {
    this.navController.navigateForward("/sign-in");
  }


  goToAllAppsPage() {
    this.navController.navigateForward("/all-aplications");
  }

  goToPlaced() {
    this.navController.navigateForward("/placed");
  }

  goToRecommended() {
    this.navController.navigateForward("/recommended");
  }


  

  async getCourse(event :any ){

    const user = this.auth.currentUser;
  
  if (await user) {       
   this.db.collection(event.detail.value, ref => ref.where("course", ">", ""))
   .valueChanges()
   .subscribe(data  => {
    this.course = data;  
  });
   } else {
      throw new Error('User not found');
    }
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }



  async getCities() {

    const user = this.auth.currentUser;

    if (await user) { 
    this.db.collection('studentProfile', ref => ref.where("city", ">", ""))
      .valueChanges()
      .subscribe((data: any[]) => {
        this.cities = data;
        console.log(this.cities);
      });
    } else {
      throw new Error('User not found');
    }
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

  getUserCount() {
    this.db.collection('studentProfile').get().subscribe(querySnapshot => {
      this.userCount = querySnapshot.size;
    }, error => {
      console.error('Error getting user count:', error);
    });
  }


  getRecommendedCounts() {
    this.db.collection('studentProfile', ref => ref.where('status', '==', 'recommended')).get().subscribe(querySnapshot => {
      this.count = querySnapshot.size;
    }, error => {
      console.error('Error getting user count:', error);
    });
  }

  getPlacedCounts() {
    this.db.collection('studentProfile', ref => ref.where('status', '==', 'placed')).get().subscribe(querySnapshot => {
      this.placed = querySnapshot.size;
    }, error => {
      console.error('Error getting user count:', error);
    });
  }
  
  
  


  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }
  goToView(): void {
    this.navController.navigateBack('/staffprofile');
  }

  handleMenuClick() {
    console.log('Menu button clicked');
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

async goToAddUser(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.addUser === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/add-user');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to Add user Page:', error);
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

}
