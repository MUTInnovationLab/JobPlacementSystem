import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { PDFDocument } from 'pdf-lib';
import { FormBuilder } from '@angular/forms';
import { MunicipalityService } from '../services/municipality.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

interface Experience {
  company: string;
  employmentPeriod: string;
  jobTitle: string;
  jobDescription: string;
  employmentPeriodend: string;
}

interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  company:string;
}

interface Qualification {
  Qdescription: string;
  degree: string;
  studyField: string;
  universityOrCollege: string;
  gradeAverage: string;
  graduationYear: string;
}

interface Language {
  languagen: string;
}

interface Skill {
  skilln: string;
  description: string;
  level: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  provinces: any[];
  maspalas: any[];
  selectedProvince: string = '';
  selectedMaspala: string = '';
  reports: any[] = [];

  fullname: string = '';
  gender: string = '';
  birthdate: string = '';
  email: string = '';
  phone: string = '';
  altPhone: string = '';
  address: string = '';
  city: string = '';
  country: string = '';
  gradeAverage: string = '';
  studentno: string = '';
  qualification: string = '';
  graduationYear: string = '';
  universityOrCollege: string = '';
  selectedOption: string = '';
  level: string = '';
  faculty: string = '';
  objective: string = '';
  code: string = '';
  license: string = '';
  recommendDate: string = '';
  placedDate: string = '';

  academicRrdFile: File | null = null;
  CertificatesFile: File | null = null;
  idFile: File | null = null;
  letterFile: File | null = null;

  showSecondDropdownFlag: boolean = false;
  references: Reference[] = [];
  experiences: Experience[] = [];
  qualifications: Qualification[] = [];
  languages: Language[] = [];
  skill: Skill[] = [];

  acardemicRrdUpload: AngularFireUploadTask | undefined;
  CerfUpload: AngularFireUploadTask | undefined;
  idUpload: AngularFireUploadTask | undefined;
  letterUpload: AngularFireUploadTask | undefined;
  cvUpload: AngularFireUploadTask | undefined;

  emailError: string | null = null;
  phoneError: string | null = null;
  altphoneError: string | null = null;
  addressError: string | null = null;
  cityError: string | null = null;
  genderError: string | null = null;
  countryError: string | null = null;
  codeError: string | null = null;
  fullNameError: string | null = null;
  provinceError: string | null = null;
  bithDateError: string | null = null;
  municipalityError: string | null = null;

  academicRecordURl: string = '';
  certicatesUrl: string = '';
  idURL: string = '';
  letterURL: string = '';
  cvUrl: string = '';
  AllInOnePdfURL: string = '';

  userDocumentt: any;
  course: any[] = [];
  arrayOn: boolean = false;

  

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phoneNumPattern = /^((?:\+27|27)|0)(\d{2})-?(\d{3})-?(\d{4})$/;
  currentDate: string
  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private fStorage: AngularFireStorage,
    private db: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private municipalityService: MunicipalityService
  ) {
    this.provinces = this.municipalityService.provinces;
    this.maspalas = this.municipalityService.maspalas;
    this.getUserToUpdate();
    this.currentDate = new Date().toISOString();
  }

  updateCountry() {
    if (this.selectedProvince !== 'International') {
      this.country = 'South Africa';
    }
  }

  onProvinceChange() {
    this.selectedMaspala = ''; // Reset the selected municipality when province changes
  }

  getMunicipalities(): string[] {
    if (this.selectedProvince) {
      const provinceData = this.maspalas.find(
        (data: any) => data.province === this.selectedProvince
      );
      return provinceData ? provinceData.maspalas : [];
    }
    return [];
  }

  ngOnInit() {}

  addReference() {
    this.references.push({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      company:'',
    });
  }

  addSkill() {
    this.skill.push({
      skilln: '',
      description: '',
      level: '',
    });
  }

  addLanguage() {
    this.languages.push({
      languagen: '',
    });
  }

  addExperience() {
    this.experiences.push({
      company: '',
      employmentPeriod: '',
      jobTitle: '',
      jobDescription: '',
      employmentPeriodend: '',
    });
  }

  addQualification() {
    this.qualifications.push({
      Qdescription: '',
      degree: '',
      studyField: '',
      universityOrCollege: '',
      gradeAverage: '',
      graduationYear: '',
    });
  }

  async Validation() {
    this.provinceError = null;
    this.genderError = null;
    this.fullNameError = null;
    this.emailError = null;
    this.phoneError = null;
    this.altphoneError = null;
    this.addressError = null;
    this.cityError = null;
    this.countryError = null;
    this.codeError = null;
    this.bithDateError = null;
    // this.studyFieldError = null;
    // this.gradeaverageError = null;
    // this.degreeError = null;
    // this.fieldError = null;
    // this.universityError = null;
    // this.yearError = null;
    // this.refError = null;
    this.municipalityError = null;

    if (!this.faculty) {
      alert('Please select your faculty.');
      return;
    }

    if (!this.selectedOption) {
      alert('Please select your course.');
      return;
    }

    if (!this.level) {
      alert('Please select your level.');
      return;
    }

    if (!this.fullname) {
      this.fullNameError = 'Please enter your fullname.';
      alert('Please enter your fullname.');
      return;
    }

    if (this.gender === '') {
      this.genderError = 'Please select your gender.';
      alert('Please select your gender.');
      return;
    }

    if (this.birthdate === '') {
      this.bithDateError = 'Please choose your birth date.';
      alert('Please choose your birth date.');
      return;
    }

    if (!this.email) {
      this.emailError = 'Please enter your email.';
      alert('please enter your email.');
      return;
    }

    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email Address.';
      alert('please enter a valid Address.');
      return;
    }

    if (!this.phone) {
      this.phoneError = 'Please enter your phone number.';
      alert('Please enter your phone number.');
      return;
    }

    if (!/^[0-9]+$/.test(this.phone)) {
      this.phoneError = 'Please enter a valid phone number.';
      alert(this.phoneError);
      return;
    }

    //starts
    if (!this.altPhone) {
      this.altphoneError = 'Please enter your alternative phone number.';
      alert('Please enter your alternative phone number.');
      return;
    }

    if (!/^[0-9]+$/.test(this.altPhone)) {
      this.altphoneError = 'Please enter a valid alternative phone number.';
      alert(this.altphoneError);
      return;
    }

    //ends

    if (!this.address) {
      this.addressError = 'Please enter your Address.';
      alert('Please enter your Address.');
      return;
    }

    if (!this.city) {
      this.cityError = 'Please enter your City.';
      alert('Please enter your city.');
      return;
    }

    if (this.selectedProvince === '') {
      this.provinceError = 'Please select your province.';
      alert('Please select your province.');
      return;
    }

    if (this.country === '') {
      this.countryError = 'Please enter your Country.';
      alert('Please enter your country.');
      return;
    }

    if (!this.code) {
      this.codeError = 'Please enter your Postal Code.';
      alert('Please enter your postal code.');
      return;
    }

   
    this.submitOrUpdate();
  }

  removeReference(reference: any) {
    const index = this.references.indexOf(reference);
    if (index > -1) {
      this.references.splice(index, 1);
    }
  }

  removeQualification(qualification: any) {
    const index = this.qualifications.indexOf(qualification);
    if (index > -1) {
      this.qualifications.splice(index, 1);
    }
  }

  removeSkill(skill: any) {
    const index = this.skill.indexOf(skill);
    if (index > -1) {
      this.skill.splice(index, 1);
    }
  }

  removeLanguage(language: any) {
    const index = this.languages.indexOf(language);
    if (index > -1) {
      this.languages.splice(index, 1);
    }
  }

  showSecondDropdown(subOption: string) {
    if (subOption === 'A') {
      this.showSecondDropdownFlag = true;
    } else {
      this.showSecondDropdownFlag = false;
    }
  }

  removeExperience(experience: any) {
    const index = this.experiences.indexOf(experience);
    if (index !== -1) {
      this.experiences.splice(index, 1);
    }
  }

  getIonBirthdate($event: any) {
    this.birthdate = $event.detail.value.split('T')[0];
  }
  getIonGreduationYear($event: any) {
    this.graduationYear = $event.detail.value.split('-')[0];
  }

  async save() {
    const loader = await this.loadingController.create({
      message: 'submitting...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      const user = this.auth.currentUser;

      if (await user) {
        const bothFilesSelected =
          this.academicRrdFile &&
          this.idFile &&
          (this.level !== 'WIL' || this.letterFile);

        if (bothFilesSelected) {
          let file = null,
            fileId = null,
            fileLetter = null;
          if (
            this.academicRrdFile instanceof FileList &&
            this.idFile instanceof FileList &&
            this.letterFile instanceof FileList
          ) {
            file = this.academicRrdFile.item(0);
            fileId = this.idFile.item(0);
            fileLetter = this.letterFile.item(0);
          } else {
            file = this.academicRrdFile;
            fileId = this.idFile;
            fileLetter = this.letterFile;
          }

          // Upload academic record file
          const path = `AcademicRecords/${this.academicRrdFile?.name || 'unnamed'}`;
          const fileRef = this.fStorage.ref(path);
          this.acardemicRrdUpload = this.fStorage.upload(path, file);
          await this.acardemicRrdUpload;
          const pdfFile =
            await this.acardemicRrdUpload.task.snapshot.ref.getDownloadURL();
          this.academicRecordURl = pdfFile;

          // Upload ID file
          const idpath = `ID/${this.idFile?.name || 'unnamed'}`;
          const fileRefId = this.fStorage.ref(idpath);
          this.idUpload = this.fStorage.upload(idpath, fileId);
          await this.idUpload;
          const pdfFile3 =
            await this.idUpload.task.snapshot.ref.getDownloadURL();
          this.idURL = pdfFile3;

          if (this.level === 'WIL') {
            // Upload letter file
            const pathLetter = `Letters/${this.letterFile?.name || 'unnamed'}`;
            const fileRefLetter = this.fStorage.ref(pathLetter);
            this.letterUpload = this.fStorage.upload(pathLetter, fileLetter);
            await this.letterUpload;
            const pdfFile4 =
              await this.letterUpload.task.snapshot.ref.getDownloadURL();
            this.letterURL = pdfFile4;
          }

          let fileCerf = null;

          if (this.CertificatesFile instanceof FileList) {
            fileCerf = this.CertificatesFile.item(0);
          } else {
            fileCerf = this.CertificatesFile;
          }

          if (this.CertificatesFile) {
            const pathCerf = `Certificates/${this.CertificatesFile.name}`;
            const fileRefCerf = this.fStorage.ref(pathCerf);
            this.CerfUpload = this.fStorage.upload(pathCerf, fileCerf);
            await this.CerfUpload;

            const pdfFile2 =
              await this.CerfUpload.task.snapshot.ref.getDownloadURL();
            this.certicatesUrl = pdfFile2;
          }
        } else {
          loader.dismiss();
          if (!this.academicRrdFile) {
            alert('Academic record is required');
          } else if (this.level === 'WIL' && !this.letterFile) {
            alert('Eligibility Letter is required');
          } else if (!this.idFile) {
            alert('ID file is required');
          }
          return;
        }

        const currentDate = firebase.firestore.Timestamp.now();

        await this.generatePDF();
        await this.db.collection('studentProfile').add({
          fullName: this.fullname,
          email: this.email,
          phoneNumber: this.phone,
          alternativePhoneNumber: this.altPhone,
          gender: this.gender,
          birthdate: this.birthdate,
          address: this.address,
          provice: this.selectedProvince,
          city: this.city,
          country: this.country,
          studentno: this.studentno,
          postalCode: this.code,
          municipality: this.selectedMaspala,
          objective: this.objective,
          experience: this.experiences,
          references: this.references,
          qualifications: this.qualifications,
          gradeAverage: this.gradeAverage,
          skills: this.skill,
          license: this.license,
          languages: this.languages,
          graduationYear: this.graduationYear,
          status: 'pending',
          course: this.selectedOption,
          recommended: '0',
          universityOrCollege: this.universityOrCollege,
          cvUrl: this.cvUrl,
          certicatesUrl: this.certicatesUrl,
          level: this.level,
          faculty: this.faculty,
          // companyName: this.companyName,
          // companyNames: this.companyNames,
          // count: this.count,
          recommendDate: this.recommendDate,
          placedDate: this.placedDate,
          createdAt: currentDate.toDate(),
          academicRecordURl: this.academicRecordURl,
          AllInOnePdfURL: this.AllInOnePdfURL,
          idURL: this.idURL,
          letterURL: this.letterURL,
          loginCount: 0,
          reports: this.reports,
        });

        loader.dismiss();
        alert('Information successfully saved');
        this.navCtrl.navigateForward('/view');
      } else {
        loader.dismiss();
        throw new Error('User not found');
      }
    } catch (error: any) {
      loader.dismiss();
      console.error(error);

      const errorMessage = error.message || 'An error occurred';
      alert(errorMessage);
    }
  }

  async uploadFileAndGetURL(file: File, path: string): Promise<string> {
    const fileRef = this.fStorage.ref(path);
    const uploadTask = this.fStorage.upload(path, file);
    await uploadTask;
    return await uploadTask.task.snapshot.ref.getDownloadURL();
  }

  async deleteFileIfExists(url: string): Promise<void> {
    if (url) {
      try {
        const fileRef = this.fStorage.storage.refFromURL(url);
        await fileRef.delete();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }

  async update() {
    const loader = await this.loadingController.create({
      message: 'Updating...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      const user = await this.auth.currentUser;

      if (user) {
        const bothfilesSelected =
          this.academicRrdFile &&
          this.CertificatesFile &&
          this.idFile &&
          this.letterFile;

        if (this.academicRrdFile) {
          const academicRecordPath = `AcademicRecords/${this.academicRrdFile.name}`;
          this.academicRecordURl = await this.uploadFileAndGetURL(
            this.academicRrdFile,
            academicRecordPath
          );
          await this.deleteFileIfExists.call(
            this,
            this.userDocumentt.academicRecordURl
          );
        } else {
          this.academicRecordURl = this.userDocumentt.academicRecordURl;
        }

        if (this.CertificatesFile) {
          const certificatesPath = `Certificates/${this.CertificatesFile.name}`;
          this.certicatesUrl = await this.uploadFileAndGetURL(
            this.CertificatesFile,
            certificatesPath
          );
          await this.deleteFileIfExists.call(
            this,
            this.userDocumentt.certicatesUrl
          );
        } else {
          this.certicatesUrl = this.userDocumentt.certicatesUrl;
        }

        if (this.letterFile) {
          const letterPath = `letters/${this.letterFile.name}`;
          this.letterURL = await this.uploadFileAndGetURL(
            this.letterFile,
            letterPath
          );
          await this.deleteFileIfExists.call(
            this,
            this.userDocumentt.letterURL
          );
        } else {
          this.letterURL = this.userDocumentt.letterURL;
        }

        if (this.idFile) {
          const idPath = `ID/${this.idFile.name}`;
          this.idURL = await this.uploadFileAndGetURL(this.idFile, idPath);
          await this.deleteFileIfExists.call(this, this.userDocumentt.idURL);
        } else {
          this.idURL = this.userDocumentt.idURL;
        }

      
        try {
          const fileRefAll = this.fStorage.storage.refFromURL(
            this.userDocumentt.AllInOnePdfURL
          );
          await fileRefAll.delete();
        } catch (error) {
          console.error('Error deleting merged file:', error);
        }

        await this.generatePDF();

        try {
          const fileRefA = this.fStorage.storage.refFromURL(
            this.userDocumentt.cvUrl
          ); // Delete the file
          await fileRefA.delete();
        } catch (error) {
          console.error('Error deleting cv file:', error);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.db
          .collection('studentProfile')
          .ref.where('email', '==', user.email)
          .get()
          .then((querySnapshot) => {
            const typedSnapshot =
              querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

            if (typedSnapshot.empty) {
              alert('User not found');
              return;
            }

            const documentId = typedSnapshot.docs[0].id;

            this.db
              .collection('studentProfile')
              .doc(documentId)
              .update({
                fullName: this.fullname,
                email: this.email,
                phoneNumber: this.phone,
                alternativePhoneNumber: this.altPhone,
                gender: this.gender,
                birthdate: this.birthdate,
                address: this.address,
                municipality: this.selectedMaspala,
                provice: this.selectedProvince,
                city: this.city,
                country: this.country,
                studentno: this.studentno,
                postalCode: this.code,
                experience: this.experiences,
                references: this.references,
                qualifications: this.qualifications,
                gradeAverage: this.gradeAverage,
                skill: this.skill,
                languages: this.languages,
                graduationYear: this.graduationYear,
                status: 'pending',
                course: this.selectedOption,
                recommended: '0',
                cvUrl: this.cvUrl,
                certicatesUrl: this.certicatesUrl,
                level: this.level,
                faculty: this.faculty,
                academicRecordURl: this.academicRecordURl,
                AllInOnePdfURL: this.AllInOnePdfURL,
                idURL: this.idURL,
                letterURL: this.letterURL,
                reports: this.reports,
              })
              .then(async () => {
                await this.getUserToUpdate();
                alert('User updated successfully');
              })
              .catch((error: any) => {
                const errorMessage = error.message;
                alert(errorMessage);
              });
          })
          .catch((error: any) => {
            const errorMessage = error.message;
            alert(errorMessage);
          });

        loader.dismiss();
        alert('Information successfully saved');
        this.navCtrl.navigateForward('/view');
      } else {
        loader.dismiss();
        throw new Error('User not found');
      }
    } catch (error: any) {
      loader.dismiss();
      console.error(error);

      const errorMessage = error.message || 'An error occurred';
      alert(errorMessage);
    }
  }

  goToHomePage(): void {
    this.navCtrl.navigateBack('/home');
  }

  uploadAcademicRrd(event: any) {
    const file: File = event.target.files[0];
    if (file && file.size <= 3000000) {
      this.academicRrdFile = file;
    } else {
      console.log(
        'Invalid file. File must be in PDF format and have a size less than 2MB.'
      );
    }
  }

  uploadCertificates(event: any) {
    const file: File = event.target.files[0];
    if (file && file.size <= 3000000) {
      this.CertificatesFile = file;
    } else {
      console.log(
        'Invalid file. File must be in PDF format and have a size less than 2MB.'
      );
    }
  }

  uploadID(event: any) {
    const file: File = event.target.files[0];
    if (file && file.size <= 3000000) {
      this.idFile = file;
    } else {
      console.log(
        'Invalid file. File must be in PDF format and have a size less than 2MB.'
      );
    }
  }
  uploadLetter(event: any) {
    const file: File = event.target.files[0];
    if (file && file.size <= 3000000) {
      this.letterFile = file;
    } else {
      console.log(
        'Invalid file. File must be in PDF format and have a size less than 2MB.'
      );
    }
  }
  removeAcademicRecord(event: Event) {
    this.academicRrdFile = null;
    const button = event.currentTarget as HTMLButtonElement;
    const fileInput = button.parentElement?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  removeCertificates(event: Event) {
    this.CertificatesFile = null;
    const button = event.currentTarget as HTMLButtonElement;
    const fileInput = button.parentElement?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  removeID(event: Event) {
    this.idFile = null;
    const button = event.currentTarget as HTMLButtonElement;
    const fileInput = button.parentElement?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  removeLetter(event: Event) {
    this.letterFile = null;
    const button = event.currentTarget as HTMLButtonElement;
    const fileInput = button.parentElement?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Did this just to test

  async generatePDF(): Promise<void> {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    try {
      const docDefinition: TDocumentDefinitions = {
        background: '#F5F5F5',
        content: [],
        styles: {
          header: {
            color: '#006281',
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 5],
          },
          headerDetails: {
            fontSize: 12,
            color: '#fff',
            margin: [0, 0, 0, 5],
          },
          titleBar: {
            color: '#FFFFFF',
            fillColor: '#006281',
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 10],
          },
          sectionTitle: {
            color: '#006281',
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 2],
          },
          content: {
            color: '#000000',
            fontSize: 12,
            margin: [0, 2, 0, 2],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 5],
          },
        },
      };
  
      // Add initial content
      (docDefinition.content as Content[]).push(
        {
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [
              [
                {
                  fillColor: '#C89015',
                  text: [
                    { text: this.fullname, style: 'header' },
                    { text: '\n' },
                    {
                      text: `${this.address}\n${this.email}\n${this.phone}\n${this.gender}`,
                      style: 'headerDetails',
                    },
                  ],
                  alignment: 'center',
                  fontSize: 24,
                  margin: [0, 10, 0, 20],
                },
              ],
            ],
          },
        },
        { text: '', margin: [0, 5, 0, 10] },
        {
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [
              [
                {
                  fillColor: '#006281',
                  text: 'Personal Summary',
                  style: 'titleBar',
                },
              ],
            ],
          },
        },
        { text: '', margin: [0, 5, 0, 10] },
        { text: this.objective, style: 'content' }
      );
  
      // Add Contact Information
      (docDefinition.content as Content[]).push(
        {
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [
              [
                {
                  fillColor: '#006281',
                  text: 'CONTACT INFORMATION',
                  style: 'titleBar',
                },
              ],
            ],
          },
        },
        { text: '', margin: [0, 5, 0, 10] },
        { text: 'Address:', style: 'sectionTitle' },
        { text: this.address, style: 'content' },
        { text: 'Email:', style: 'sectionTitle' },
        { text: this.email, style: 'content' },
        { text: 'Phone Number:', style: 'sectionTitle' },
        { text: this.phone, style: 'content' },
        { text: 'Alternative Phone Number:', style: 'sectionTitle' },
        { text: this.altPhone, style: 'content' },
        { text: 'City:', style: 'sectionTitle' },
        { text: this.city, style: 'content' },
        { text: '', margin: [0, 10, 0, 10] }
      );
  
      // Add Education
      if (this.qualifications.length > 0) {
        (docDefinition.content as Content[]).push(
          {
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#006281',
                    text: 'EDUCATION',
                    style: 'titleBar',
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }
        );
  
        this.qualifications.forEach((qualification) => {
          (docDefinition.content as Content[]).push(
            { text: `Degree: ${qualification.degree}`, style: 'content' },
            { text: `Study Field: ${qualification.studyField}`, style: 'content' },
            { text: `Course Description: ${qualification.Qdescription}`, style: 'content' },
            { text: `University/College: ${qualification.universityOrCollege}`, style: 'content' },
            { text: 'Grade Average', style: 'content' },
            { text: this.gradeAverage, style: 'content' },
            { text: `Graduation year: ${qualification.graduationYear}`, style: 'content' },
            { text: '', margin: [0, 5, 0, 10] }
          );
        });
      }
  
      // Add Languages
      if (this.languages.length > 0) {
        (docDefinition.content as Content[]).push(
          {
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#006281',
                    text: 'LANGUAGES',
                    style: 'titleBar',
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }
        );
  
        this.languages.forEach((language) => {
          (docDefinition.content as Content[]).push(
            { text: `LANGUAGE: ${language.languagen}`, style: 'subheader' },
            { text: '', margin: [0, 5, 0, 5] }
          );
        });
      }
  
      // Add Skills
      if (this.skill.length > 0) {
        (docDefinition.content as Content[]).push(
          {
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#006281',
                    text: 'SKILLS',
                    style: 'titleBar',
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }
        );
  
        this.skill.forEach((skill) => {
          (docDefinition.content as Content[]).push(
            { text: `SKILL: ${skill.skilln}`, style: 'content' },
            { text: `DESCRIPTION: ${skill.description}`, style: 'content' },
            { text: `LEVEL: ${skill.level}`, style: 'content' },
            { text: '', margin: [0, 5, 0, 5] }
          );
        });
      }
  
      // Add License
      if (this.license !== '') {
        (docDefinition.content as Content[]).push(
          {
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#006281',
                    text: 'LICENSE',
                    style: 'titleBar',
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] },
          { text: `License: ${this.license}`, style: 'content' },
          { text: '', margin: [0, 5, 0, 10] }
        );
      }
  
      // Add Experience
      if (this.experiences.length > 0) {
        (docDefinition.content as Content[]).push(
          {
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#006281',
                    text: 'EXPERIENCE',
                    style: 'titleBar',
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }
        );
  
        this.experiences.forEach((experience) => {
          (docDefinition.content as Content[]).push(
            { text: `Company: ${experience.company}`, style: 'subheader' },
            { text: `Job Title: ${experience.jobTitle}`, style: 'content' },
            { text: `Employment Period: ${experience.employmentPeriod} - ${experience.employmentPeriodend}`, style: 'content' },
            { text: `Job Description: ${experience.jobDescription}`, style: 'content' },
            { text: '', margin: [0, 10, 0, 10] }
          );
        });
      }
  
      // Add References
      if (this.references.length > 0) {
        (docDefinition.content as Content[]).push(
          {
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#006281',
                    text: 'REFERENCES',
                    style: 'titleBar',
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }
        );
  
        this.references.forEach((reference) => {
          (docDefinition.content as Content[]).push(
            { text: `Name: ${reference.name}`, style: 'subheader' },
            { text: `Relationship: ${reference.relationship}`, style: 'content' },
            { text: `Phone Number: ${reference.phone}`, style: 'content' },
            { text: `Email: ${reference.email}`, style: 'content' },
            { text: '', margin: [0, 10, 0, 10] }
          );
        });
      }
  
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  
      const blob = await new Promise<Blob>((resolve) => {
        pdfDocGenerator.getBlob(resolve);
      });
  
      try {
        // Load the CV PDF
        const cvPdf = await PDFDocument.load(await blob.arrayBuffer());
  
        // Merge academic record pages
        if (this.academicRrdFile) {
          const academicRecordPdf = await PDFDocument.load(
            await this.academicRrdFile.arrayBuffer()
          );
          const maxAcademicRecordPages = Math.min(
            academicRecordPdf.getPageCount(),
            4
          );
  
          for (
            let pageNumber = 0;
            pageNumber < maxAcademicRecordPages;
            pageNumber++
          ) {
            const [page] = await cvPdf.copyPages(academicRecordPdf, [pageNumber]);
            cvPdf.addPage(page);
          }
        }
  
        // Merge certificate pages
        if (this.CertificatesFile) {
          const certificatePdf = await PDFDocument.load(
            await this.CertificatesFile.arrayBuffer()
          );
          const maxCertificatePages = Math.min(
            certificatePdf.getPageCount(),
            4
          );
  
          for (
            let pageNumber = 0;
            pageNumber < maxCertificatePages;
            pageNumber++
          ) {
            const [page] = await cvPdf.copyPages(certificatePdf, [pageNumber]);
            cvPdf.addPage(page);
          }
        }
  
        // Merge ID pages
        if (this.idFile) {
          const idPdf = await PDFDocument.load(await this.idFile.arrayBuffer());
          const maxIDPages = Math.min(idPdf.getPageCount(), 4);
  
          for (let pageNumber = 0; pageNumber < maxIDPages; pageNumber++) {
            const [page] = await cvPdf.copyPages(idPdf, [pageNumber]);
            cvPdf.addPage(page);
          }
        }
  
        // Merge letter pages
        if (this.letterFile) {
          const letterPdf = await PDFDocument.load(
            await this.letterFile.arrayBuffer()
          );
          const maxLetterPages = Math.min(letterPdf.getPageCount(), 4);
  
          for (let pageNumber = 0; pageNumber < maxLetterPages; pageNumber++) {
            const [page] = await cvPdf.copyPages(letterPdf, [pageNumber]);
            cvPdf.addPage(page);
          }
        }
  
        // Save the merged PDF
        const mergedPdfBytes = await cvPdf.save();
  
        // Upload the merged PDF file to Firebase Storage
        const fileName = `${this.fullname}_${Date.now()}.pdf`;
        const filePath = `AllInOne/${fileName}`;
        const storageRef = this.fStorage.ref(filePath);
        const snapshotMerged = await storageRef.put(mergedPdfBytes);
  
        this.AllInOnePdfURL = await snapshotMerged.ref.getDownloadURL();
        console.log(
          'Combined PDF file uploaded. Download URL:',
          this.AllInOnePdfURL
        );
  
        // Continue with the rest of the code for updating the CV URL
        const filename = `${this.fullname}__${Date.now()}_CV.pdf`;
        const path = `cv/${filename}`;
        const fileRef = this.fStorage.ref(path);
  
        const snapshot = await fileRef.put(blob);
        const downloadURL = await snapshot.ref.getDownloadURL();
  
        this.cvUrl = downloadURL;
        console.log('update cv ' + this.cvUrl);
      } catch (error: any) {
        console.error('Error occurred while merging PDFs:', error);
        alert('pdf error: ' + error.message);
      }
    } catch (error: any) {
      console.error('Error occurred while generating PDF:', error);
      alert('PDF generation error: ' + error.message);
    }
  }
  async getCourse(event: any) {
    const user = await this.auth.currentUser;
    if (user) {
      this.db
        .collection(event.detail.value, (ref) => ref.where('course', '>', ''))
        .valueChanges()
        .subscribe((data: any[]) => {
          this.course = data;
        });
    } else {
      throw new Error('User not found');
    }
  }

  isArray(obj: any) {
    return Array.isArray(obj);
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
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            this.auth
              .signOut()
              .then(() => {
                localStorage.removeItem('currentUser');
                this.navCtrl.navigateForward('/sign-in');

                this.presentToast();
              })
              .catch((error) => {});
          },
        },
      ],
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

  goToView() {
    this.navCtrl.navigateForward('/view');
  }


  async getUserToUpdate() {
    const userFirebase = await this.auth.currentUser;
    let user: firebase.User | null;

    if (userFirebase) {
      user = userFirebase;
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    if (user) {
      const email = user.email;
      this.email = user?.email ?? '';
      this.db
        .collection('studentProfile', (ref) => ref.where('email', '==', email))
        .valueChanges()
        .subscribe((data: any[]) => {
          if (data.length > 0) {
            const userDocument = data[0];
            this.userDocumentt = data[0];
            this.arrayOn = true;
            console.log('allToUpdate ' + this.userDocumentt);
            this.fullname = userDocument.fullName;
            this.gender = userDocument.gender;
            this.city = userDocument.city;
            this.birthdate = userDocument.birthdate;
            this.email = userDocument.email;
            this.phone = userDocument.phoneNumber;
            this.altPhone = userDocument.alternativePhoneNumber;
            this.address = userDocument.address;
            this.code = userDocument.postalCode;
            this.country = userDocument.country;
            this.studentno = userDocument.studentno;
            this.selectedProvince = userDocument.provice;
            this.graduationYear = userDocument.graduationYear;
            this.faculty = userDocument.faculty;

            this.level = userDocument.level;
            this.selectedOption = userDocument.course;

            this.experiences = userDocument.experience;
            this.references = userDocument.references;
            this.skill = userDocument.skills;
            this.languages = userDocument.languages;
            this.objective = userDocument.objective;
            this.AllInOnePdfURL = userDocument.AllInOnePdfURL;
            this.selectedMaspala = userDocument.municipality;
            (this.idURL = userDocument.idURL),
              (this.letterURL = userDocument.letterURL),
              (this.reports = userDocument.reports);
            console.log('old data :', data);

            this.db
            .collection(this.faculty, (ref) => ref.where('course', '>', ''))
            .valueChanges()
            .subscribe((data: any[]) => {
              this.course = data;
            });

          this.birthdate = userDocument.birthdate;
        }
      });
  } else {
    localStorage.removeItem('currentUser');
  }
}

async submitOrUpdate() {
  if (this.arrayOn) {
    await this.update();
  } else {
    await this.save();
  }
}

}
