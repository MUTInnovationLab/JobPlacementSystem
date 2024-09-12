import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { finalize, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  navController: NavController;
  userDocument: any;
  user$: Observable<any> = of(null);
  detProfile: any;
  role = {
    history: 'off',
    statistic: 'off',
    employment: 'off',
    wil: 'off',
    addUser: 'off',
    validation: 'off'
  };
  selectedIssue: string | null = null; 
  details: string = '';
  tableData: any[] = [];
  userData: any;
  currentPage: number = 1;
  rowsPerPage: number = 10;
  recipient: any;
  userEmailArray: string[] = [];
  isNavOpen: boolean = false;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.getUser();
    this.navController = navCtrl;

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.user$ = of(firebase.auth().currentUser).pipe(
          switchMap((user) => {
            if (user) {
              const query = this.afs.collection('registeredStaff', (ref) =>
                ref.where('email', '==', user.email)
              );
              return query.valueChanges().pipe(
                switchMap((documents: any[]) => {
                  if (documents.length > 0) {
                    const userProfile = documents[0];
                    console.log(userProfile);
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

  ngOnInit() {
    // Initialization logic here
  }

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

  async navigateBasedOnRole(page: string): Promise<void> {
    try {
      await this.getUser();

      let authorized = false;
      let message = '';

      if (this.userDocument && this.userDocument.role) {
        switch (page) {
          case 'wil-page':
            authorized = this.userDocument.role.wil === 'on';
            message = 'Unauthorized user for Wil page.';
            break;
          case 'employment-page':
            authorized = this.userDocument.role.employment === 'on';
            message = 'Unauthorized user for Employment page.';
            break;
          case 'history':
            authorized = this.userDocument.role.history === 'on';
            message = 'Access denied to History page.';
            break;
          case 'reports':
            authorized = this.userDocument.role.statistic === 'on';
            message = 'Unauthorized user for Reports page.';
            break;
          case 'add-user':
            authorized = this.userDocument.role.addUser === 'on';
            message = 'Unauthorized user for add user page.';
            break;
          case 'ga-validation':
            authorized = this.userDocument.role.validation === 'on';
            message = 'Unauthorized user for grade validator page.';
            break;
          default:
            authorized = false;
            message = 'Invalid page.';
            break;
        }
      }

      if (authorized) {
        this.navController.navigateForward('/' + page);
      } else {
        const toast = await this.toastController.create({
          message: 'Unauthorized Access: You do not have the necessary permissions to access this page. Please contact the administrator for assistance.',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error navigating based on role:', error);
    }
  }

  goToWil(): Promise<void> {
    return this.navigateBasedOnRole('wil-page');
  }

  goToEmployment(): Promise<void> {
    return this.navigateBasedOnRole('employment-page');
  }

  goToHistory(): Promise<void> {
    return this.navigateBasedOnRole('history');
  }

  goToReports(): Promise<void> {
    return this.navigateBasedOnRole('reports');
  }

  goToAddUser(): Promise<void> {
    return this.navigateBasedOnRole('add-user');
  }

  goToValidator(): Promise<void> {
    return this.navigateBasedOnRole('ga-validation');
  }

  signOut() {
    this.navController.navigateForward('/home');
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

  toggleNav() {
    console.log('menu');
    this.isNavOpen = !this.isNavOpen;
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
              this.navCtrl.navigateForward("/sign-in");
              this.presentToast();
            }).catch((error) => {
              console.error('Sign out error:', error);
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
}