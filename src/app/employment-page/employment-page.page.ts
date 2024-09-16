import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ViewAcademicRecordModalPage } from '../view-academic-record-modal/view-academic-record-modal.page';
import { CvModalPage } from '../cv-modal/cv-modal.page';
import 'firebase/firestore';
import { getFirestore, writeBatch, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MunicipalityProviderService } from '../services/municipality-provider.service';
import { FilterService } from '../services/filter.service';
import { EmailServiceService } from '../services/email-service.service';

@Component({
  selector: 'app-employment-page',
  templateUrl: './employment-page.page.html',
  styleUrls: ['./employment-page.page.scss'],
})
export class EmploymentPagePage implements OnInit {

  // Adjust the path as needed

 
  
provinces: string[] = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"];

maspalas: { province: string, maspalas: string[] }[] = [
  
{ province: "Eastern Cape", maspalas: ["Alfred Nzo District Municipality",
  "Amahlathi Local Municipality",
  "Amathole District Municipality",
  "Blue Crane Route Local Municipality",
  "Buffalo City Metropolitan Municipality",
  "Buffalo City Metropolitan Municipality",
  "Chris Hani District Municipality",
  "Dr AB Xuma Local Municipality",
  "Dr Beyers Naudé Local Municipality",
  "Elundini Local Municipality",
  "Emalahleni Local Municipality",
  "Enoch Mgijima Local Municipality",
  "Great Kei Local Municipality",
  "Ingquza Hill Local Municipality","Intsika Yethu Local Municipality",
  "Inxuba Yethemba Local Municipality",
  "Joe Gqabi District Municipality",
  "King Sabata Dalindyebo Local Municipality",
  "Kouga Local Municipality",
  "KouKamma Local Municipality",
  "Makana Local Municipality",
  "Matatiele Local Municipality",
  "Mbhashe Local Municipality",
  "Mhlontlo Local Municipality",
  "Mnquma Local Municipality",
  "Ndlambe Local Municipality",
  "Nelson Mandela Bay Metropolitan Municipality",
  "Ngqushwa Local Municipality",
  "Ntabankulu Local Municipality",
  "Nyandeni Local Municipality",
  "OR Tambo District Municipality",
  "Port St Johns Local Municipality",
  "Raymond Mhlaba Local Municipality",
  "Sakhisizwe Local Municipality",
  "Senqu Local Municipality",
  "Sunday's River Valley Local Municipality",
  "Umzimvubu Local Municipality",
  "Walter Sisulu Local Municipality",
  "Winnie Madikizela-Mandela Local Municipality",] },

{ province: "Free State", maspalas: ["Dihlabeng Local Municipality",
"Fezile Dabi District Municipality",
"Kopanong Local Municipality",
"Lejweleputswa District Municipality",
"Letsemeng Local Municipality",
"Mafube Local Municipality",
"Maluti-a-Phofung Local Municipality",
"Mangaung Metropolitan Municipality",
"Mantsopa Local Municipality",
"Masilonyana Local Municipality",
"Matjhabeng Local Municipality",
"Metsimaholo Local Municipality",
"Mohokare Local Municipality",
"Moqhaka Local Municipality",
"Nala Local Municipality",
"Ngwathe Local Municipality",
"Nketoana Local Municipality",
"Phumelela Local Municipality",
"Setsoto Local Municipality",
"Thabo Mofutsanyana District Municipality",
"Tokologo Local Municipality",
"Tswelopele Local Municipality",
"Xhariep District Municipality"] },
  
{ province: "Gauteng", maspalas: ["City of Ekurhuleni",
  "City of Johannesburg Metropolitan Municipality",
  "City of Tshwane Metropolitan Municipality",
  "Emfuleni Local Municipality",
  "Lesedi Local Municipality",
  "Merafong Local Municipality",
  "Midvaal Local Municipality",
  "Mogale City Local Municipality",
  "Rand West City Local Municipality",
  "Sedibeng District Municipality",
  "West Rand District Municipality"] },
  
{ province: "KwaZulu-Natal", maspalas: ["AbaQulusi Local Municipality",
  "Alfred Duma Local Municipality",
  "Amajuba District Municipality",
  "Big 5 Hlabisa Local Municipality (The)",
  "City of uMhlathuze Local Municipality",
  "Dannhauser Local Municipality",
  "Dr Nkosazana Dlamini Zuma Local Municipality",
  "eDumbe Local Municipality",
  "Emadlangeni Local Municipality",
  "Endumeni Local Municipality",
  "eThekwini Metropolitan Municipality",
  "Greater Kokstad Local Municipality",
  "Harry Gwala District Municipality",
  "iLembe District Municipality",
  "Impendle Local Municipality",
  "Inkosi Langalibalele Local Municipality",
  "Jozini Local Municipality",
  "King Cetshwayo District Municipality",
  "KwaDukuza Local Municipality",
  "Mandeni Local Municipality",
  "Maphumulo Local Municipality",
  "Mkhambathini Local Municipality",
  "Mpofana Local Municipality",
  "Msunduzi Local Municipality",
  "Mthonjaneni Local Municipality",
  "Mtubatuba Local Municipality",
  "Ndwedwe Local Municipality",
  "Newcastle Local Municipality",
  "Nkandla Local Municipality",
  "Nongoma Local Municipality",
  "Nquthu Local Municipality",
  "Okhahlamba Local Municipality",
  "Ray Nkonyeni Local Municipality",
  "Richmond Local Municipality",
  "Ubuhlebezwe Local Municipality",
  "Ugu District Municipality",
  "Ulundi Local Municipality",
  "Umdoni Local Municipality",
  "uMfolozi Local Municipality",
  "uMgungundlovu District Municipality",
  "Umhlabuyalingana Local Municipality",
  "uMkhanyakude District Municipality",
  "uMlalazi Local Municipality",
  "uMngeni Local Municipality",
  "uMshwathi Local Municipality",
  "uMsinga Local Municipality",
  "Umuziwabantu Local Municipality",
  "Umvoti Local Municipality",
  "Umzimkhulu Local Municipality",
  "uMzinyathi District Municipality",
  "Umzumbe Local Municipality",
  "uPhongolo Local Municipality",
  "uThukela District Municipality",
  "Zululand District Municipality"] },

{ province: "Limpopo", maspalas: ["Ba-Phalaborwa Local Municipality",
  "Bela-Bela Local Municipality",
  "Blouberg Local Municipality",
  "Capricorn District Municipality",
  "Elias Motswaledi Local Municipality",
  "Ephraim Mogale Local Municipality",
  "Fetakgomo Tubatse Local Municipality",
  "Greater Giyani Local Municipality",
  "Greater Letaba Local Municipality",
  "Greater Tzaneen Local Municipality",
  "Lepelle-Nkumpi Local Municipality",
  "Lephalale Local Municipality",
  "Makhado Local Municipality",
  "Makhudutamaga Local Municipality",
  "Maruleng Local Municipality",
  "Modimolle-Mookgophong Local Municipality",
  "Mogalakwena Local Municipality",
  "Molemole Local Municipality",
  "Mopani District Municipality",
  "Musina Local Municipality",
  "Polokwane Local Municipality",
  "Sekhukhune District Municipality",
  "Thabazimbi Local Municipality",
  "Thulamela Local Municipality",
  "Vhembe District Municipality",
  "Waterberg District Municipality"] },
  
{ province: "Mpumalanga", maspalas: ["Bushbuckridge Local Municipality",
  "Chief Albert Luthuli Local Municipality",
  "City of Mbombela Local Municipality",
  "Dipaleseng Local Municipality",
  "Dr JS Moroka Local Municipality",
  "Ehlanzeni District Municipality",
  "Emakhazeni Local Municipality",
  "Emalahleni Local Municipality",
  "Gert Sibande District Municipality",
  "Govan Mbeki Local Municipality",
  "Lekwa Local Municipality",
  "Mkhondo Local Municipality",
  "Msukaligwa Local Municipality",
  "Nkangala District Municipality",
  "Nkomazi Local Municipality",
  "Pixley Ka Seme Local Municipality",
  "Steve Tshwete Local Municipality",
  "Thaba Chweu Local Municipality",
  "Thembisile Hani Local Municipality",
  "Victor Khanye Local Municipality"] },
  
{ province: "North West", maspalas: ["Bojanala Platinum District Municipality",
  "City of Matlosana Local Municipality",
  "Ditsobotla Local Municipality",
  "Dr Kenneth Kaunda District Municipality",
  "Dr Ruth Segomotsi Mompati District Municipality",
  "Greater Taung Local Municipality",
  "Kagisano-Molopo Local Municipality",
  "Kgetlengrivier Local Municipality",
  "Lekwa-Teemane Local Municipality",
  "Madibeng Local Municipality",
  "Mahikeng Local Municipality",
  "Mamusa Local Municipality",
  "Maquassi Hills Local Municipality",
  "Moretele Local Municipality",
  "Moses Kotane Local Municipality",
  "Naledi Local Municipality",
  "Ngaka Modiri Molema District Municipality",
  "Ramotshere Moiloa Local Municipality",
  "Ratlou Local Municipality",
  "Rustenburg Local Municipality",
  "Tswaing Local Municipality"] },
  
{ province: "Northern Cape", maspalas: ["!Kheis Local Municipality",
  "Dawid Kruiper Local Municipality",
  "Dikgatlong Local Municipality",
  "Emthanjeni Local Municipality",
  "Frances Baard District Municipality",
  "Ga-segonyana Local Municipality",
  "Gamagara Local Municipality",
  "Hantam Local Municipality",
  "Joe Morolong Local Municipality",
  "John Taolo Gaetsewe District Municipality",
  "Kai !Garib Local Municipality",
  "Kamiesberg Local Municipality",
  "Kareeberg Local Municipality",
  "Karoo Hoogland Local Municipality",
  "Kgatelopele Local Municipality",
  "Khâi-ma Local Municipality",
  "Magareng Local Municipality",
  "Nama Khoi Local Municipality",
  "Namakwa District Municipality",
  "Phokwane Local Municipality",
  "Pixley Ka Seme District Municipality",
  "Renosterberg Local Municipality",
  "Richtersveld Local Municipality",
  "Siyancuma Local Municipality",
  "Siyathemba Local Municipality",
  "Sol Plaatje Local Municipality",
  "Thembelihle Local Municipality",
  "Tsantsabane Local Municipality",
  "Ubuntu Local Municipality",
  "Umsobomvu Local Municipality",
  "ZF Mgcawu District Municipality"] },
  
  { province: "Western Cape", maspalas: ["Beaufort West Local Municipality",
  "Bergrivier Local Municipality",
  "Bitou Local Municipality",
  "Breede Valley Local Municipality",
  "Cape Agulhas Local Municipality",
  "Cape Winelands District Municipality",
  "Cederberg Local Municipality",
  "Central Karoo District Municipality",
  "City of Cape Town Metropolitan Municipality",
  "Drakenstein Local Municipality",
  "Garden Route District Municipality",
  "George Local Municipality",
  "Hessequa Local Municipality",
  "Kannaland Local Municipality",
  "Knysna Local Municipality",
  "Laingsburg Local Municipality",
  "Langeberg Local Municipality",
  "Matzikama Local Municipality",
  "Mossel Bay Local Municipality",
  "Oudtshoorn Local Municipality",
  "Overberg District Municipality",
  "Overstrand Local Municipality",
  "Prince Albert Local Municipality",
  "Saldanha Bay Local Municipality",
  "Stellenbosch Local Municipality",
  "Swartland Local Municipality",
  "Swellendam Local Municipality",
  "Theewaterskloof Local Municipality",
  "West Coast District Municipality",
  "Witzenberg Local Municipality"] },
];


selectedProvince: any;
selectedMaspala: any;



userDocument: any;
userData: any;
recipient = '';
faculty = '';
crs = '';
level = '';
course: any[] = [];
subCourses: any;
references: any[] = [];
coursedata: any[] = [];
showSecondDropdownFlag: boolean = false;
selectedOption: any;
wilData: any[] = [];
recommended: any = 0;
naturalSciencesData: any[] = [];
selectAllCheckbox: any;
tableData: any[] = [];
academicRecordURl: any;
document = '';
gradeAverage = '';
employment = '';
selectedItems: any[] = [];
showEmailFields = false;
recipientEmail: any;
subject: any;
body: any;
urlArrays: any[] = [];
currentPage: number = 1;
rowsPerPage: number = 10;
cities: any[] = [];
city: any[] = [];
province = '';
genderbase = '';
companyNames: any[] = [];
recommendDate:any;

filteredStudentProfiles: any[] = [];

municipalities: string[] = [];
filteredMunicipalities: string[] = [];
selectedMunicipality: string = '';
filteredData: any[] = [];

searchMunicipalities(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  if (searchTerm.trim() === '') {
    this.filteredMunicipalities = [];
  } else {
    this.filteredMunicipalities = this.municipalities.filter((municipality) =>
      municipality.toLowerCase().startsWith(searchTerm)
    );
  }
}

selectMunicipality(municipality: string) {
  this.selectedMunicipality = municipality;
  this.filteredMunicipalities = [];
  this.filter();
}

isFormValid(): boolean {
  if (this.showEmailFields) {
    const isRecipientValid = typeof this.recipient === 'string' && this.recipient.trim().length > 0;
    const isRecipientEmail = isRecipientValid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.recipient);

    return (
      this.companyNames &&
      isRecipientEmail &&
      this.subject &&
      this.body
    );
  }

  return false;
}

isFieldEmpty(field: string | string[]): boolean {
  if (Array.isArray(field)) {
    return field.some((item: string) => !item || item.trim().length === 0);
  }
  return !field || field.trim().length === 0;
}



getSelectionCount(): number {
  return this.tableData.filter((data: { checked: any }) => data.checked)
    .length;
}

constructor(
  private http: HttpClient,
  private alertController: AlertController,
  private toastController: ToastController,
  private modalController: ModalController,
  private firestore: AngularFirestore,
  private db: AngularFirestore,
  private loadingController: LoadingController,
  navCtrl: NavController,
  private auth: AngularFireAuth,
  private navController: NavController,
  private municipalityService: MunicipalityProviderService,
  private filterService: FilterService,
  private emailService: EmailServiceService
) {
  this.getWilData();
  this.municipalities = this.municipalityService.getMunicipalities();
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

isNavOpen: boolean = false;
toggleNav() {
  console.log('menu');
  this.isNavOpen = !this.isNavOpen;
}

onProvinceChange() {
  this.selectedMaspala = null; // Reset the selected municipality when province changes
}

getMunicipalities(): string[] {
  if (this.selectedProvince) {
    const provinceData = this.maspalas.find(data => data.province === this.selectedProvince);
    return provinceData ? provinceData.maspalas : [];
  }
  return [];
}


ngOnInit() {}


async getCourse(event: any) {
  this.db
    .collection(event.detail.value, (ref) => ref.where('course', '>', ''))
    .valueChanges()
    .subscribe((data) => {
      this.course = data;
      console.log(this.faculty + '  :dd');
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



avg() {
  if (this.gradeAverage !== "") {
    this.filterService.avgFilter(this.gradeAverage, this.crs).subscribe(filteredData => {
      this.tableData = filteredData;
    });
  }
}

getWilData() {
  this.db
    .collection('studentProfile', (ref) =>
      ref.where('status', '==', 'active').where('level', '==', 'EMPLOYMENT')
    )
    .snapshotChanges()
    .subscribe((data) => {
      this.userData = data.map((d) => {
        const id = d.payload.doc.id;
        const docData = d.payload.doc.data() as any; // Cast docData as any type
        return { id, ...docData };
      });
      console.log(this.userData);
      this.tableData = this.userData;
    });
}

//open cv
async openCVModal(cvUrl: any) {
  const modal = await this.modalController.create({
    component: CvModalPage,
    componentProps: {
      cvUrl: cvUrl,
    },
  });

  await modal.present();
}


filter() {
  let query = this.firestore.collection('studentProfile', (ref) => {
    let filteredQuery = ref.where('status', '==', 'active').where('level', '==', 'EMPLOYMENT');

    if (this.faculty !== '') {
      filteredQuery = filteredQuery.where('faculty', '==', this.faculty);
    }

    if (this.crs !== '') {
      filteredQuery = filteredQuery.where('course', '==', this.crs);
    }

    if (this.genderbase !== '') {
      filteredQuery = filteredQuery.where('gender', '==', this.genderbase);
    }

    if (this.gradeAverage !== '') {
      const minGrade = Number(this.gradeAverage);
      const maxGrade = minGrade + 10;
      filteredQuery = filteredQuery.where('gradeAverage', '>=', minGrade).where('gradeAverage', '<', maxGrade);
    }

    if (this.selectedMunicipality !== '') {
      filteredQuery = filteredQuery.where('municipality', '==', this.selectedMunicipality);
    }

    if (this.selectedProvince) {
      filteredQuery = filteredQuery.where('provice', '==', this.selectedProvince);
    }

    if (this.selectedMaspala) {
      filteredQuery = filteredQuery.where('municipality', '==', this.selectedMaspala);
    }

    return filteredQuery;
  });

  query.valueChanges().subscribe((data) => {
    console.log(data);
    this.tableData = data; // Assign retrieved data to tableData
  });
}




genderFilter() {
   this.filter();
}


async openViewAcademicRecordModal(pdfUrl: any) {
  const modal = await this.modalController.create({
    component: ViewAcademicRecordModalPage,
    componentProps: {
      pdfUrl: pdfUrl,
    },
  });

  await modal.present();
}



goToView(): void {
this.navController.navigateBack('/staffprofile');
}
ionViewDidEnter() {
 
}


handleMenuClick() {
  console.log('Menu button clicked');
}


//selecting the checkboxes
async selectAll() {
  if (this.selectAllCheckbox) {
    const updatePromises = [];
    for (const data of this.tableData) {
      if (!data.checked) {
        data.checked = true;
        const promise = this.updateSelectedItems(
          data,
          data.AllInOnePdfURL,
          data.email
        );
        updatePromises.push(promise);
        if (!this.selectedItems.includes(data)) {
          this.selectedItems.push(data);
          this.urlArrays.push(data.AllInOnePdfURL);
          this.userEmailArray.push(data.email);
        }
      }
    }
    await Promise.all(updatePromises);
  } else {
    for (const data of this.tableData) {
      if (data.checked) {
        data.checked = false;
        const index = this.selectedItems.indexOf(data);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
          this.urlArrays.splice(index, 1);
          this.userEmailArray.splice(index, 1);
        }
      }
    }
  }
  console.log(this.userEmailArray);
  console.log(this.urlArrays);
  // Check if any checkbox is checked
  this.showEmailFields = this.selectedItems.length > 0;
}

userEmailArray: any[] = [];


updateSelectedItems(item: any, url: any, email: any) {
  if (item.checked) {
    this.selectedItems.push(item);
    this.urlArrays.push(url);
    this.userEmailArray.push(email);
  } else {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
      this.urlArrays.splice(index, 1);
      this.userEmailArray.splice(index, 1);
    }
  }
  console.log('singleE', this.userEmailArray);
  // Check if any checkbox is checked
  if (this.userEmailArray.length == 0) {
    this.selectAllCheckbox = false;
  }

  this.showEmailFields = this.selectedItems.length > 0;
}
//Your cv has been forwarded
async sendEmail() {
  const recipient = this.recipient;
  const subject = this.subject;
  const body = this.emailService.formatBody(this.body);
  const urlArrays = this.urlArrays;

  try {
    const response = await this.emailService.sendEmail(recipient, subject, body, urlArrays);
    this.emailService.handleEmailResponse(response, this.selectedItems, this.companyNames);
    this.sendRecommendationNotification();
  } catch (error) {
    console.error('Error:', error);
  }
  this.clear();
}
formatBody() {
  this.body =  this.emailService.formatBody(this.body);
}
sendRecommendationNotification() {

  this.emailService.sendRecommendationNotification(this.recipient, this.userEmailArray,"Your CV has been forwarded...");
}

clear(){
 this.recipient = "";
this.subject = " ";
this.body = " ";
this.urlArrays = [];
}

}
