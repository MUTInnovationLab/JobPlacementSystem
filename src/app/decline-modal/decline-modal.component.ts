import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EmailServiceService } from '../services/email-service.service';

@Component({
  selector: 'app-decline-modal',
  templateUrl: './decline-modal.component.html',
  styleUrls: ['./decline-modal.component.scss'],
})
export class DeclineModalComponent implements OnInit {

  @Input() email = '';
  @Input() studentId = '';
  reason: string = '';

  constructor(
    private modalController: ModalController,
    private db: AngularFirestore,
    private toastController: ToastController,
    private emailService: EmailServiceService // Use the EmailServiceService
  ) {}

  ngOnInit() {}

  async send() {
    try {
      // Update student status to 'declined'
      await this.db.collection('studentProfile').doc(this.studentId).update({ status: 'declined' });
      console.log('Declined false information!!!');
      this.showToast('Declined false information!!!');
      // Format the body and send email using the service
      this.formatBody();
      await this.emailService.sendDeclineNotification(this.email, 'Application Rejection Notice', this.reason);

    } catch (error) {
      console.error('Error:', error);
    }

    this.modalController.dismiss();
  }

  formatBody() {
    this.reason = this.reason.replace(/\n/g, '<br>');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
