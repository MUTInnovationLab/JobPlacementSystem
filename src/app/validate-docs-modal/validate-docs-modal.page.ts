import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';

register(); // Register Swiper custom elements

@Component({
  selector: 'app-validate-docs-modal',
  templateUrl: './validate-docs-modal.page.html',
  styleUrls: ['./validate-docs-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ValidateDocsModalPage implements OnInit {
 
  urlArray: SafeResourceUrl[] = [];

  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private navParams: NavParams
  ) {
    const urls = ['cvUrl', 'academicRecordURl', 'letterURL', 'idURL'];
    this.urlArray = urls.map(url => this.sanitizeUrl(this.navParams.get(url)));
  }

  ngOnInit() {}

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}