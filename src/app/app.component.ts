import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showNav: boolean = false;
  private navRoutes: string[] = [
    '/dashboard',
    '/add-user',
    '/ga-validation',
    '/employment-page',
    '/history',
    '/wil-page',
    '/staffprofile',
    '/reports'
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNav = this.navRoutes.some(route => event.urlAfterRedirects.startsWith(route));
    });
  }
}