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
import { EmailServiceService } from '../services/email-service.service';


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
    private db: AngularFirestore, private modalController: ModalController,
    private emailService: EmailServiceService) {

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
        this.emailService.sendApproveNotification(email); // Pass the email to sendDeclineNotification method
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
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