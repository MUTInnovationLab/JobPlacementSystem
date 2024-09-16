import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staffprofile',
  templateUrl: './staffprofile.page.html',
  styleUrls: ['./staffprofile.page.scss'],
})
export class StaffprofilePage implements OnInit {
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
  userDocument: any;

  userDetails = [
    { label: 'Name', property: 'Name' },
    { label: 'Email', property: 'email' },
    { label: 'Position', property: 'position' },
    { label: 'Staff No.', property: 'staffNumber' }
  ];

  tasks = [
    { label: 'History', role: 'history' },
    { label: 'Reports', role: 'statistic' },
    { label: 'Employment', role: 'employment' },
    { label: 'WIL', role: 'wil' },
    { label: '+New Users', role: 'addUser' },
    { label: 'Profile_Validation', role: 'validation' }
  ];

  issueOptions = [
    'Uploading Files',
    'Status Change',
    'Creating Profile',
    'Profile Not Found',
    'Performance',
    'Other'
  ];

  constructor(
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private alertController: AlertController,
    private db: AngularFirestore,
    private toastController: ToastController,
    private router: Router
  ) {
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
  }
  getProfileImage(): string {
    const userProfile = this.detProfile; // Replace this with your actual profile data
    return userProfile && userProfile.profileImage
      ? userProfile.profileImage
      : 'assets/avatat.jpg'; // Replace with the path to your default profile image or placeholder
  }

  submitReport() {
    // Assuming you are using Firebase Authentication, you can get the currently logged-in user's email like this:
    const user = firebase.auth().currentUser;
    const userEmail = user ? user.email : null;
  
    const reportData = {
      issue: this.selectedIssue,
      details: this.details,
      userEmail: userEmail, // Add the user's email to the reportData
      status: "pending-Issue" // Add the status field with the value "pending-Issue"
    };
  
    console.log("reportData:", reportData); // Add this line for debugging
  
    // Add the report data to the Firestore collection
    this.firestore.collection('REPORTS').add(reportData)
      .then(() => {
        // Reset form fields or perform any other necessary actions
        this.selectedIssue = null;
        this.details = '';
        // Close the modal if needed
      })
      .catch(error => {
        console.error('Error adding report:', error);
        // Handle the error as needed
      });
  }
  


  
  goToMenuPage() {
    //this.navController.navigateForward('/menu');

    this.router.navigateByUrl("/menu");

  }
  
 

}
