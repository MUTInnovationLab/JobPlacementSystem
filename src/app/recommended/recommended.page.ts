import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  NavController,AlertController } from '@ionic/angular';

import { Timestamp } from 'firebase/firestore';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.page.html',
  styleUrls: ['./recommended.page.scss'],
})
export class RecommendedPage implements OnInit {

  

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
  recommended: any = 0;
  naturalSciencesData: any[] =[];
  gradeAverage="";
  currentPage: number = 1;
  rowsPerPage: number = 10;
  companyNames : any[]=[];
  studentno='';

  constructor( private firestore: AngularFirestore, 
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private navController: NavController,
    private db: AngularFirestore,
    private filterService: FilterService) {

      this.getAllData();
     }

     previousPage() {
      this.currentPage--;
    }
    goToView(): void {
      this.navController.navigateBack('/staffprofile');
    }
  

    goToAddUserPage(): void {
      this.navController.navigateBack('/reports');
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
    
    
    nextPage() {
      this.currentPage++;
    }
    
    totalPages(): number {
      return Math.ceil(this.tableData.length / this.rowsPerPage);
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
  
    
 
  applyFilter() {
    this.filterService.applyFilter(this.faculty).subscribe(data => {
      // Manually filter for 'recommended' status
      this.tableData = data.filter(student => student.status === 'recommended');
      console.log('Filtered by faculty and status:', this.tableData);
    });
  }

  applySecondFilter() {
    this.filterService.applySecondFilter(this.crs).subscribe(data => {
      
      this.tableData = data.filter(student => student.status === 'recommended');
      console.log('Filtered by course and status:', this.tableData);
    });
  }

  levelFilter() {
    this.filterService.levelFilter(this.level, this.faculty, this.crs).subscribe(data => {
      
      let filteredData = data.filter(student => student.status === 'recommended');

      if (this.gradeAverage !== '') {
        const lowerRange = Number(this.gradeAverage);
        const upperRange = lowerRange + 9;

        
        filteredData = filteredData.filter((student) => {
          const gradeAverage = Number(student.gradeAverage);
          return gradeAverage >= lowerRange && gradeAverage <= upperRange;
        });
      }

      console.log('Filtered by level, faculty, course, and status:', filteredData);
      this.tableData = filteredData;
    });
  }

  avg() {
    if (this.gradeAverage !== '') {
      this.filterService.avgFilter(this.gradeAverage, this.crs).subscribe(data => {
        
        const filteredData = data.filter(student => student.status === 'recommended');
        this.tableData = filteredData;
        console.log('Filtered by grade average and status:', filteredData);
      });
    }
  }



  async updateStatus(email: string) {
    const query = this.db.collection('studentProfile', ref => ref.where('email', '==', email));
    const snapshot = await query.get().toPromise();
  
    if (snapshot && snapshot.docs.length > 0) {
      const docRef = snapshot.docs[0].ref;
      const placedDate = Timestamp.now(); 
  
      await docRef.update({ 
        status: 'placed',
        placedDate: placedDate,
      });
      console.log('Status updated successfully');
    } else {
      console.log('No matching documents found');
    }
  }
  
  
}
