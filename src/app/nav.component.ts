import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  template: `
    <ion-header [translucent]="true">
      <nav>
        <div class="header-container">
          <a class="logo">
            <img src="assets/MUT LOGO.png" alt="Logo">{{ currentPageTitle }}
          </a>
          <div class="hamburger-menu" (click)="toggleNav()" [ngClass]="{ 'active': isNavOpen }">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <div class="nav-links" [ngClass]="{ 'open': isNavOpen }">
            <a (click)="goToHome()" class="nav-link">Home</a>
            <a (click)="goToAddUser()" class="nav-link">Add Staff</a>
            <div class="nav-link business-dropdown" [ngClass]="{ 'active': isDropdownOpen }">
              <span (click)="toggleDropdown($event)"><ion-icon name="caret-down-outline"></ion-icon>Tasks</span>
              <div class="dropdown-content">
                <a (click)="goToValidator()" class="dropdown-item">Profile Validator</a>
                <a (click)="goToEmployment()" class="dropdown-item">Employment</a>
                <a (click)="goToHistory()" class="dropdown-item">History</a>
                <a (click)="goToWil()" class="dropdown-item">WIL</a>
                <a (click)="goToView()" class="dropdown-item">Profile</a>
              </div>
            </div>
            <a (click)="goToReports()" class="nav-link">Reports</a>
            <a (click)="presentConfirmationAlert()" class="nav-link">Sign Out</a>
          </div>
        </div>
      </nav>
    </ion-header>
  `
})
export class NavComponent implements OnInit {
  isNavOpen: boolean = false;
  userDocument: any;
  user$: Observable<any> = of(null);
  currentPageTitle: string = 'Dashboard';
  isDropdownOpen: boolean = false;


  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUser();
    this.updatePageTitle(); // Add this line to set the initial page title
    this.setupPageTitleListener();
  }
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  setupPageTitleListener() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
      console.log('Route changed, new title:', this.currentPageTitle);
    });
  }

  updatePageTitle() {
    const currentRoute = this.router.url;
    switch (currentRoute) {
      case '/menu':
        this.currentPageTitle = 'Dashboard';
        break;
      case '/add-user':
        this.currentPageTitle = 'Add Staff';
        break;
      case '/ga-validation':
        this.currentPageTitle = 'Profile Validator';
        break;
      case '/employment-page':
        this.currentPageTitle = 'Employment Dashboard';
        break;
      case '/history':
        this.currentPageTitle = 'History Dashboard';
        break;
      case '/wil-page':
        this.currentPageTitle = 'WIL Dashboard';
        break;
      case '/staffprofile':
        this.currentPageTitle = 'Profile';
        break;
      case '/reports':
        this.currentPageTitle = 'Reports Dashboard';
        break;
      default:
        this.currentPageTitle = 'Dashboard';
    }
    console.log('Current page title:', this.currentPageTitle);
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
    if (!this.isNavOpen) {
      this.isDropdownOpen = false;
    }
  }
  async getUser(): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      try {
        const querySnapshot = await this.afs
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

  goToView(): void {
    this.navController.navigateBack('/staffprofile');
  }

  goToHome(){
    this.navController.navigateForward("/menu");
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