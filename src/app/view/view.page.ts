import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  user$: Observable<any> = of(null);
  showAll: boolean = false;
  detProfile: any;
  pdfUrl: any;
  status = '';
  selectedIssue: string | null = null;
  details: string = ''; // Add this line to declare the 'details' property

  constructor(
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.initializeUser();
  }

  ngOnInit() {}

  private initializeUser() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.user$ = of(firebase.auth().currentUser).pipe(
          switchMap((user) => {
            if (user) {
              return this.afs.collection('studentProfile', ref => ref.where('email', '==', user.email))
                .valueChanges()
                .pipe(
                  switchMap((documents: any[]) => {
                    if (documents.length > 0) {
                      const userProfile = documents[0];
                      this.detProfile = userProfile;
                      this.pdfUrl = userProfile.AllInOnePdfURL;
                      this.status = userProfile.status;
                      return of(userProfile);
                    } else {
                      console.log('No matching documents.');
                      return of(null);
                    }
                  })
                );
            } else {
              return of(null);
            }
          })
        );
      })
      .catch((error) => {
        console.error("Error enabling Firebase authentication persistence:", error);
      });
  }

  getStatusBoxStyle(status: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'pending-box',
      active: 'active-box',
      recommended: 'recommended-box',
      placed: 'placed-box',
      declined: 'declined-box'
    };
    return `status-box ${statusClasses[status] || ''}`;
  }

  getStatusTextColor(status: string): string {
    return ['pending', 'recommended'].includes(status) ? '#000' : '#fff';
  }

  submitReport() {
    const user = firebase.auth().currentUser;
    const userEmail = user ? user.email : null;
    const reportData = {
      issue: this.selectedIssue,
      details: this.details,
      userEmail: userEmail,
      status: "pending-Issue"
    };
    this.firestore.collection('REPORTS').add(reportData)
      .then(() => {
        this.selectedIssue = null;
        this.details = '';
      })
      .catch(error => console.error('Error adding report:', error));
  }

  isButtonDisabled(): boolean {
    return this.status === "placed";
  }

  goToHomePage(): void {
    this.navCtrl.navigateBack('/home');
  }

  toggleAllDetails() {
    this.showAll = !this.showAll;
  }

  goToCreate() {
    this.navCtrl.navigateForward("/create");
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
          handler: () => console.log('Confirmation canceled')
        }, {
          text: 'Confirm',
          handler: () => {
            this.auth.signOut().then(() => {
              this.navCtrl.navigateForward("/sign-in");
              this.presentToast();
            }).catch((error) => console.error('Sign out error:', error));
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

  async deleteProfile() {
    const loader = await this.loadingController.create({
      message: 'Deleting',
      cssClass: 'custom-loader-class'
    });
    await loader.present();

    const user = await this.auth.currentUser;
    if (user && this.detProfile) {
      const filesToDelete = [
        this.detProfile.cvUrl,
        this.detProfile.certicatesUrl,
        this.detProfile.academicRecordURl,
        this.detProfile.AllInOnePdfURL,
        this.detProfile.letterURL,
        this.detProfile.idURL
      ];

      filesToDelete.forEach(file => {
        if (file) this.deleteFile(file);
      });

      this.afs.collection('studentProfile', ref => ref.where('email', '==', user.email)).get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
            this.detProfile = null;
            loader.dismiss();
            alert("Profile deleted successfully");
          });
        });
    } else {
      loader.dismiss();
      alert("You don't have a profile");
    }
  }

  deleteFile(url: string): void {
    const fileRef = this.storage.refFromURL(url);
    fileRef.delete().pipe(
      finalize(() => console.log('File deleted:', url))
    ).subscribe(
      () => {},
      (error) => alert('An error occurred while deleting the file: ' + error.message)
    );
  }

  async confermDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to DELETE your profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'my-custom-alert',
          handler: () => console.log('Confirmation canceled')
        }, {
          text: 'Confirm',
          handler: () => this.deleteProfile()
        }
      ]
    });
    await alert.present();
  }

  openPDF() {
    window.open(this.pdfUrl, '_blank');
  }

  async updateStatus(status: string) {
    const user = firebase.auth().currentUser;
    if (user) {
      const email = user.email;
      const query = this.afs.collection('studentProfile', ref => ref.where('email', '==', email));
      const snapshot = await query.get().toPromise();

      if (snapshot && snapshot.docs.length > 0) {
        const docRef = snapshot.docs[0].ref;
        await docRef.update({ status });
        console.log('Status updated successfully');
      } else {
        console.log('No matching documents found');
      }
    } else {
      console.log('User not logged in');
    }
  }
}