import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface StudentProfile {
  fullName: string;
  gender: string;
  level: 'EMPLOYMENT' | 'WIL';
  loginCount: number;
  count?: number;
  status?: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  @ViewChild('statsChart') statsChartRef!: ElementRef;
  @ViewChild('levelChart') levelChartRef!: ElementRef;
  @ViewChild('genderChart') genderChartRef!: ElementRef;

  isNavOpen = false;
  userDocument: any;
  userCount = 0;
  recommendedCount = 0;
  placedCount = 0;
  employmentCount = 0;
  wilCount = 0;
  maleCount = 0;
  femaleCount = 0;

  topLoginUsers: StudentProfile[] = [];
  topCVSentUsers: StudentProfile[] = [];

  statsChart!: Chart;
  levelChart!: Chart;
  genderChart!: Chart;

  constructor(
    private navController: NavController,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getUserCount();
    this.getRecommendedCount();
    this.getPlacedCount();
    this.getTopLoginUsers();
    this.getTopCVSentUsers();
    this.getEmploymentAndWilCount();
    this.getGenderCount();
  }

  ionViewDidEnter() {
    this.getUser();
    this.createCharts();
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  async getUser() {
    const user = await this.auth.currentUser;
    if (user) {
      try {
        const querySnapshot = await this.db
          .collection('registeredStaff')
          .ref.where('email', '==', user.email)
          .get();
        if (!querySnapshot.empty) {
          this.userDocument = querySnapshot.docs[0].data();
        }
      } catch (error) {
        console.error('Error getting user document:', error);
      }
    }
  }

  getUserCount() {
    this.db.collection('studentProfile').get().subscribe(querySnapshot => {
      this.userCount = querySnapshot.size;
      this.updateCharts();
    });
  }

  getRecommendedCount() {
    this.db.collection('studentProfile', ref => ref.where('status', '==', 'recommended')).get().subscribe(querySnapshot => {
      this.recommendedCount = querySnapshot.size;
      this.updateCharts();
    });
  }

  getPlacedCount() {
    this.db.collection('studentProfile', ref => ref.where('status', '==', 'placed')).get().subscribe(querySnapshot => {
      this.placedCount = querySnapshot.size;
      this.updateCharts();
    });
  }

  async getTopLoginUsers() {
    const snapshot = await this.db.collection('studentProfile', ref => 
      ref.orderBy('loginCount', 'desc').limit(10)
    ).get().toPromise();

    this.topLoginUsers = snapshot?.docs.map(doc => doc.data() as StudentProfile) || [];
  }

  async getTopCVSentUsers() {
    const snapshot = await this.db.collection('studentProfile', ref => 
      ref.orderBy('count', 'desc').limit(10)
    ).get().toPromise();

    this.topCVSentUsers = snapshot?.docs.map(doc => doc.data() as StudentProfile) || [];
  }

  async getEmploymentAndWilCount() {
    const snapshot = await this.db.collection('studentProfile').get().toPromise();
    this.employmentCount = snapshot?.docs.filter(doc => (doc.data() as StudentProfile).level === 'EMPLOYMENT').length || 0;
    this.wilCount = snapshot?.docs.filter(doc => (doc.data() as StudentProfile).level === 'WIL').length || 0;
    this.updateCharts();
  }

  async getGenderCount() {
    const snapshot = await this.db.collection('studentProfile').get().toPromise();
    this.maleCount = snapshot?.docs.filter(doc => (doc.data() as StudentProfile).gender === 'Male').length || 0;
    this.femaleCount = snapshot?.docs.filter(doc => (doc.data() as StudentProfile).gender === 'Female').length || 0;
    this.updateCharts();
  }

  createCharts() {
    this.createStatsChart();
    this.createLevelChart();
    this.createGenderChart();
  }

  createStatsChart() {
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Total Applications', 'Recommended', 'Placed', 'EMPLOYMENT', 'WIL'],
        datasets: [{
          label: 'Application Statistics',
          data: [this.userCount, this.recommendedCount, this.placedCount, this.employmentCount, this.wilCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    this.statsChart = new Chart(this.statsChartRef.nativeElement, config);
  }

  createLevelChart() {
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['EMPLOYMENT', 'WIL'],
        datasets: [{
          data: [this.employmentCount, this.wilCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'EMPLOYMENT vs WIL Distribution'
          }
        }
      }
    };
    this.levelChart = new Chart(this.levelChartRef.nativeElement, config);
  }

  createGenderChart() {
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [this.maleCount, this.femaleCount],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Gender Distribution'
          }
        }
      }
    };
    this.genderChart = new Chart(this.genderChartRef.nativeElement, config);
  }

  updateCharts() {
    if (this.statsChart) {
      this.statsChart.data.datasets[0].data = [this.userCount, this.recommendedCount, this.placedCount, this.employmentCount, this.wilCount];
      this.statsChart.update();
    }
    if (this.levelChart) {
      this.levelChart.data.datasets[0].data = [this.employmentCount, this.wilCount];
      this.levelChart.update();
    }
    if (this.genderChart) {
      this.genderChart.data.datasets[0].data = [this.maleCount, this.femaleCount];
      this.genderChart.update();
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
              this.presentToast('SIGNED OUT!');
            }).catch((error) => {
              console.error('Sign out error:', error);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }

  goToPage(page: string) {
    this.navController.navigateForward(page);
  }

  async navigateWithAuth(page: string, role: string) {
    await this.getUser();
    if (this.userDocument?.role?.[role] === 'on') {
      this.navController.navigateForward(page);
    } else {
      this.presentToast('Unauthorized user.');
    }
  }
}