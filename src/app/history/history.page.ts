import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  userDocument:any;


  selectedFaculty: any;
  tableData: any[]=[]; // Array to store filtered table data
  userData:any;
  faculty="";
  level="";
  course :any[]=[];
  crs="";
  subCourses:any;
  references: any[] = [];
  coursedata : any[]=[];
  showSecondDropdownFlag: boolean = false;
  selectedOption:any;
  historyData: any;
loginCount:any;
  recommended: any = 0;

  naturalSciencesData: any[] =[];
  year = '';
  selectedYear: any;
  studentno='';
  status='';
  genderbase='';
  

  
  constructor(private alertController: AlertController,
    private toastController: ToastController,
    private firestore: AngularFirestore, 
    private db: AngularFirestore,
    private loadingController: 
    LoadingController, navCtrl: NavController,
    private auth: AngularFireAuth,
    private navController: NavController,
    private filterService: FilterService) { 
 
    this.getHistoryData()
  }

  ngOnInit() {
   
  }

 
  
  isNavOpen: boolean = false;
  toggleNav() {
    console.log('menu');
    this.isNavOpen = !this.isNavOpen;
  }



  goToView(): void {
    this.navController.navigateBack('/staffprofile');
  }
  handleMenuClick() {
    console.log('Menu button clicked');
  }
  

  searchByStudentNo() {
    if (this.studentno && this.studentno.trim() !== '') {
      const query = this.db.collection('studentProfile', ref => ref.where('studentno', '==', this.studentno));
      query.valueChanges().subscribe((data: any[]) => {
        this.tableData = data;
      });
    } else {
      
      this.getAllData();
    }
  }

  getAllData() {

    this.db.collection('studentProfile', ref => ref.where('status', '==', 'recommended'))
      .valueChanges()
      .subscribe(data =>{
        
      this.userData=data;  
      console.log(data);
      this.tableData = data;
      
  
  });

}

  async getCourse(event :any ){

        
  this.db.collection(event.detail.value, ref => ref.where("course", ">", ""))
  .valueChanges()
  .subscribe(data  => {
    this.course = data; 
    this.faculty = event.detail.value;
    this.level = event.detail.value;
    
  });
  
  
  }


isArray(obj : any ) {
  return Array.isArray(obj)
}

  
getHistoryData() {

  this.db.collection('studentProfile')
    .valueChanges()
    .subscribe(data =>{
      
    this.historyData=data;  
    console.log(data);
    this.tableData = data;

}); 

}

applyFilter() {
  this.filterService.applyFilter(this.faculty).subscribe(data => {
    this.tableData = data;
  });
}

applySecondFilter() {
  this.filterService.applySecondFilter(this.crs).subscribe(data => {
    this.tableData = data;
  });
}

levelFilter() {
  this.filterService.levelFilter(this.level, this.faculty, this.crs).subscribe(data => {
    this.tableData = data;
  });
}



statusFilter(event:any){
this.status= event.detail.value;
}


filter() {
  this.filterService.filterStudents(this.level, this.faculty, this.crs, this.status, this.genderbase, this.studentno)
    .subscribe(data => {
      this.tableData = data;
      console.log(data);
    });
}


yearFunction(event: any) {
  const selectedYear = new Date(event.detail.value).getFullYear();

  this.filterService.filterByYear(selectedYear).subscribe(data => {
    this.tableData = data;
    console.log(data);
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

//sign out

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



goToMenuPage(): void {
  this.navController.navigateForward('/menu').then(() => {
    window.location.reload();
  });
}

goToHomePage(): void {
  this.navController.navigateBack('/home');
}
}
