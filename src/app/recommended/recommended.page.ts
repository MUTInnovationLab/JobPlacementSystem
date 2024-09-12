import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  NavController,AlertController } from '@ionic/angular';

import { Timestamp } from 'firebase/firestore';

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
    private db: AngularFirestore) {

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
  

    this.firestore
      .collection('studentProfile', ref => ref.where('faculty', '==', this.faculty).where('status', '==', 'recommended'))
      .valueChanges()
      .subscribe((data: any[]) => {
        this.tableData = data;
        console.log(data);
      });
  }
  
  
  applySecondFilter(){
  
    this.firestore
    .collection('studentProfile', ref => ref.where('course', '==', this.crs).where('status', '==', 'recommended'))
    .valueChanges()
    .subscribe((data: any[]) => {
      this.tableData = data;
      console.log(data);
    });
  
  }
  
  levelFilter() {
    let query = this.firestore.collection('studentProfile', ref => {
      let result: any = ref;
  
      if (this.level) {
        result = result.where('level', '==', this.level).where('status', '==', 'recommended');
      }
  
      if (this.faculty) {
        result = result.where('faculty', '==', this.faculty);
      }
  
      if (this.crs) {
        result = result.where('course', '==', this.crs);
      }
  
      return result;
    });
  
    query.valueChanges().subscribe((data: any[]) => {
      let filteredData = data;
  
      if (this.gradeAverage !== "") {
        const lowerRange = Number(this.gradeAverage);
        const upperRange = lowerRange + 9;
  
        filteredData = filteredData.filter((student) => {
          const gradeAverage = Number(student.gradeAverage);
          return gradeAverage >= lowerRange && gradeAverage <= upperRange;
        });
      }
  
      console.log(filteredData);
      this.tableData = filteredData;
    });
  }


  
  avg() {
    if (this.gradeAverage !== "") {
      const lowerRange = Number(this.gradeAverage);
      const upperRange = lowerRange + 9;
  
      let query = this.firestore.collection('studentProfile', ref => {
        let result: any = ref.where('status', '==', 'recommended');
  
        if (this.crs) {
          result = result.where('course', '==', this.crs);
        }
  
        return result;
      });
  
      query.valueChanges().subscribe(
        (data: any[]) => {
          const filteredData = data.filter((student) => {
            const gradeAverage = Number(student.gradeAverage);
            return gradeAverage >= lowerRange && gradeAverage <= upperRange;
          });
  
          console.log(filteredData);
          this.tableData = filteredData;
        },
        error => {
          console.error("Error retrieving data:", error);
        }
      );
    }
  }
  

  async updateStatus(email: string) {
    const query = this.db.collection('studentProfile', ref => ref.where('email', '==', email));
    const snapshot = await query.get().toPromise();
  
    if (snapshot && snapshot.docs.length > 0) {
      const docRef = snapshot.docs[0].ref;
      const placedDate = Timestamp.now(); // Current timestamp
  
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
