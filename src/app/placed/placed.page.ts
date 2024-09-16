import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController,  AlertController } from '@ionic/angular';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-placed',
  templateUrl: './placed.page.html',
  styleUrls: ['./placed.page.scss'],
})
export class PlacedPage implements OnInit {

  tableData: any[]=[];

  userData:any;

  faculty="";
  level="";
  course :any[]=[];
  crs="";
  subCourses:any;
  coursedata : any[]=[];
  showSecondDropdownFlag: boolean = false;
  selectedOption:any;
  historyData: any;
  gradeAverage="";
  recommended: any = 0;
  naturalSciencesData: any[] =[];
  currentPage: number = 1;
  rowsPerPage: number = 10;
  studentno='';



  constructor(private firestore: AngularFirestore, 
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private navController: NavController,
    private db: AngularFirestore,
  private filterService: FilterService) { 

      this.getAllData();
    }
    goToView(): void {
      this.navController.navigateBack('/staffprofile');
    }

    searchByStudentNo() {
      if (this.studentno && this.studentno.trim() !== '') {
        const query = this.db.collection('studentProfile', ref => ref.where('studentno', '==', this.studentno));
        query.valueChanges().subscribe((data: any[]) => {
          this.tableData = data;
        });
      } else {
        // If the search input is empty, reset the table data to show all entries
        this.getAllData();
      }
    }
  

    getAllData() {

      this.db.collection('studentProfile', ref => ref.where('status', '==', 'placed'))
        .valueChanges()
        .subscribe(data =>{  
        this.userData=data;  
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

  avg() {
    if (this.gradeAverage !== "") {
      this.filterService.avgFilter(this.gradeAverage, this.crs).subscribe(filteredData => {
        this.tableData = filteredData;
      });
    }
  }


  async updateStatus(email: string) {
    const query = this.db.collection('studentProfile', ref => ref.where('email', '==', email));
    const snapshot = await query.get().toPromise();
  
    if (snapshot && snapshot.docs.length > 0) {
      const docRef = snapshot.docs[0].ref;
      
  
      await docRef.update({ 
        status: 'active',
       
      });
      console.log('Status updated successfully');
    } else {
      console.log('No matching documents found');
    }
  }

  goToAddUserPage(): void {
    this.navController.navigateBack('/reports');
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
            
            });
  
  
  
          }
        }
      ]
    });
    await alert.present();
  }
  presentToast() {
    throw new Error('Method not implemented.');
  }
  


  previousPage() {
    this.currentPage--;
  }
  
  nextPage() {
    this.currentPage++;
  }
  
  totalPages(): number {
    return Math.ceil(this.tableData.length / this.rowsPerPage);
  }


  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  ngOnInit() {
  }
  //dropdown
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



}
