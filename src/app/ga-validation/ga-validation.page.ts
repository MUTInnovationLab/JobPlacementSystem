import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';



import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { ViewAcademicRecordModalPage } from '../view-academic-record-modal/view-academic-record-modal.page';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DeclineModalComponent } from '../decline-modal/decline-modal.component';
import { ValidateDocsModalPage } from '../validate-docs-modal/validate-docs-modal.page';


@Component({
  selector: 'app-ga-validation',
  templateUrl: './ga-validation.page.html',
  styleUrls: ['./ga-validation.page.scss'],
})
export class GaValidationPage implements OnInit {

  tableData: any[]=[];

  userData:any;
  currentPage: number = 1;
  rowsPerPage: number = 10;
  recipient:any;
  userEmailArray: string[] = [];
  userDocument:any;


  constructor(private http: HttpClient,private firestore: AngularFirestore, 
    private loadingController: LoadingController, 
    navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private db: AngularFirestore, private modalController: ModalController) {

      this.getAllData();
     }
     goToView(): void {
      this.navController.navigateBack('/staffprofile');
    }
  
     getAllData() {
      this.db.collection('studentProfile', ref => ref.where('status', '==', 'pending'))
        .snapshotChanges()
        .subscribe(data => {
          this.userData = data.map(d => {
            const id = d.payload.doc.id;
            const docData = d.payload.doc.data() as any; // Cast docData as any type
            return { id, ...docData };
          });
          console.log(this.userData);
          this.tableData = this.userData;
        });
    }
    
    
    isNavOpen: boolean = false;
    toggleNav() {
      console.log('menu');
      this.isNavOpen = !this.isNavOpen;
    }
    


  async openViewAcademicRecordModal(pdfUrl:any) {
    const modal = await this.modalController.create({
      component: ViewAcademicRecordModalPage,
      componentProps: {
        pdfUrl: pdfUrl
      }
    });
  
    await modal.present();
  }

  // Update the status value to "active"

  async decline(studentId: string, email: string) {

    const modal = await this.modalController.create({
      component: DeclineModalComponent,
      componentProps: {
        studentId: studentId,
        email: email
      },
      cssClass: 'modal-ion-content' // Add your desired CSS class here
    });
    
    return await modal.present();
    
  }

  approve(studentId: string, email: string) {
    const updatedStatus = 'active';
 
    this.db.collection('studentProfile').doc(studentId).update({ status: updatedStatus })
      .then(() => {
        console.log('Approved!!!');
        this.showToast('Approved!!!');
        this.sendApproveNotification(email); // Pass the email to sendDeclineNotification method
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  }


  sendApproveNotification(email: string) {
    const url = "https://mutinnovationlab.000webhostapp.com/send_approve_notification.php";
   // 'http://localhost/Co-op-project/co-operation/src/send_approve_notification.php';
    const recipient = encodeURIComponent(email);
    const subject = encodeURIComponent('Application Approval Notice');
    const body = encodeURIComponent('Thank you for submitting your cv, it is now on our database. We will forward it to companies when relevant opportunities arises.');

    // Include the parameters in the query string
    const query = `recipient=${recipient}&subject=${subject}&body=${body}`;
 
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
 
    this.http.get(url + '?' + query, { headers: headers })
      .subscribe(
        response => {
          console.log(response + ' (notification)');
          // Handle the response from the PHP file
        },
        error => {
          console.error('Error:', error + ' (notification)');
        }
      );
  }



  
  previousPage() {
    this.currentPage--;
  }
  handleMenuClick() {
    console.log('Menu button clicked');
  }
  
  
  nextPage() {
    this.currentPage++;
  }
  
  totalPages(): number {
    return Math.ceil(this.tableData.length / this.rowsPerPage);
  }

  // Update the status value to "active"
  /*approve(studentId: string) {
 
    const updatedStatus = 'active';
    
    // Make the update in the database
    this.db.collection('studentProfile').doc(studentId).update({ status: updatedStatus })
      .then(() => {
        console.log('Successfully Updated');
        this.showToast('Successfully updated');
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  }*/
  
  
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }
  

  ngOnInit() {
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

   





async openDeclineModal() {
  const modal = await this.modalController.create({
    component: DeclineModalComponent,
    componentProps: {
    
    }
  });
  return await modal.present();
}


  async openValidateModal(academicRecordURl:any,cvUrl:any,idURL:any,letterURL:any){

console.log(academicRecordURl);
  const modal = await this.modalController.create({
    component: ValidateDocsModalPage,
    componentProps: {
    
      academicRecordURl:academicRecordURl,
      cvUrl:cvUrl,
      idURL:idURL,
      letterURL:letterURL

    }
  });
  return await modal.present();



}

}
