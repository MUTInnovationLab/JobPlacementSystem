import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FormsModule } from "@angular/forms";
import { IonicModule, LoadingController, NavController, ToastController, AlertController } from "@ionic/angular";


import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-all-aplications',
  templateUrl: './all-aplications.page.html',
  styleUrls: ['./all-aplications.page.scss'],
  

})
export class AllAplicationsPage implements OnInit {

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
studentno='';


  constructor(
    private firestore: AngularFirestore, 
    private loadingController: LoadingController, 
    navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private db: AngularFirestore) { 
    this.getAllData();
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
    goToView(): void {
      this.navController.navigateBack('/staffprofile');
    }

    exportToSpreadsheet() {
  const fileName = prompt("Enter the name of the file (without extension):");
  
  if (!fileName) {
    console.log("File name not provided. Export cancelled.");
    return;
  }
  
  const filteredData = this.tableData.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);

  // Extract the desired columns from the filtered data
  const extractedData = filteredData.map(data => ({
    FullName: data.fullName,
    Email: data.email,
    Level: data.level,
    Faculty: data.faculty,
    Course: data.course,
    City: data.city,
    Status: data.status,
  }));

  // Define the column headers
  const headers = ["FullName", "Email", "Level", "Faculty", "Course", "City", "Status"];

  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(extractedData, { header: headers });

  // Set column widths
  const columnWidths = headers.map(() => ({ width: 15 }));
  worksheet['!cols'] = columnWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

  // Generate the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Save the file with the provided name
  saveAs(blob, `${fileName}.xlsx`);
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
  
    avg() {
      if (this.gradeAverage != "") {
        this.firestore
          .collection('studentProfile', ref => ref.where('gradeAverage', '>=', Number(this.gradeAverage)).where('gradeAverage', '<', Number(this.gradeAverage )+10))
          .valueChanges()
          .subscribe(
            (data: any[]) => {
              console.log(data);
              this.tableData = data;
            },
            error => {
              console.error("Error retrieving data:", error);
            }
          );
      }
    
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
    
  
    this.firestore
      .collection('studentProfile', ref => ref.where('faculty', '==', this.faculty))
      .valueChanges()
      .subscribe((data: any[]) => {
        this.tableData = data;
        console.log(data);
      });
  }
  
  
  applySecondFilter(){
  
    this.firestore
    .collection('studentProfile', ref => ref.where('course', '==', this.crs))
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
        result = result.where('level', '==', this.level);
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
      this.tableData = data;
      console.log(data);
    });
  }
  
  
  
  
  

  ngOnInit() {
    this.getAllData()
  }

  getAllData() {

    this.db.collection('studentProfile')
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

  logout(): void {
    this.navController.navigateBack('/home');
  }

}
