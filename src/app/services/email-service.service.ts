import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { getFirestore, writeBatch, doc, updateDoc, Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class EmailServiceService {
  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async sendEmail(recipient: string, subject: string, body: string, urlArrays: string[]) {
    const loader = await this.loadingController.create({
      message: 'Sending Email...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    const url = "https://mutinnovationlab.000webhostapp.com/send_email.php";
    const query = `recipient=${encodeURIComponent(recipient)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&urlArrays=${encodeURIComponent(urlArrays.join(','))}`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(url + '?' + query, { headers: headers }).toPromise()
      .then(async (response) => {

        await loader.dismiss();


        return response;
      })
      .catch(async (error) => {
        await loader.dismiss();
        console.error('Error:', error);
        throw error;
      });
  }

  formatBody(body: string): string {
    return body.replace(/\n/g, '<br>');
  }

  async handleEmailResponse(response: any, selectedItems: any[], companyNames: any[]) {
    if (response === 'Email sent successfully!!!.') {
      await this.showEmailSentAlert(response);

      const db = getFirestore();
      const batch = writeBatch(db);
      const studentStatusCountMap = new Map<string, number>();

      selectedItems.forEach((item) => {
        const docRef = doc(db, 'studentProfile', item.id);
        const newStatus = 'recommended';
        const previousCompanyNames = item.companyNames || [];

        if (item.status !== newStatus) {
          const updatedCompanyNames = [...previousCompanyNames, companyNames];
          const recommendDate = Timestamp.now();

          batch.update(docRef, {
            status: newStatus,
            companyNames: updatedCompanyNames,
            recommendDate: recommendDate,
          });

          const count = item.status === 'recommended' ? item.count || 0 : (item.count || 0) + 1;
          studentStatusCountMap.set(item.id, count);
        }
      });

      await batch.commit();

      studentStatusCountMap.forEach(async (count, studentId) => {
        const docRef = doc(db, 'studentProfile', studentId);
        await updateDoc(docRef, { count });
      });
    } else {
      await this.showEmailErrorAlert();
    }
  }

  async showEmailSentAlert(response: any) {
    const alert = await this.alertController.create({
      header: 'Email Sent',
      message: response,
      buttons: [{ text: 'OK' }],
    });
    await alert.present();
  }

  async showEmailErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Email Error',
      message: 'Email not sent. Please try again.',
      buttons: [{ text: 'OK' }],
    });
    await alert.present();
  }

  sendRecommendationNotification(recipient: string, userEmailArray: string[]) {
    const url = "https://mutinnovationlab.000webhostapp.com/send_recommendation_notification.php";
    const query = `recipient=${encodeURIComponent(recipient)}&subject=${encodeURIComponent("Recommendation Notice")}&body=${encodeURIComponent("Your CV has been forwarded...")}&emailsArray=${encodeURIComponent(userEmailArray.join(','))}`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.get(url + '?' + query, { headers: headers }).subscribe(
      () => console.log('Notification sent successfully'),
      (error) => console.error('Error sending notification:', error)
    );
  }
}
