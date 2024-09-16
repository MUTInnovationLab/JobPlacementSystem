import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private firestore: AngularFirestore) { }

  // applyFilter(faculty: string): Observable<any[]> {
  //   return this.firestore
  //     .collection('studentProfile', ref => ref.where('faculty', '==', faculty).where('status', '==', 'placed'))
  //     .valueChanges();
  // }

  applyFilter(faculty: string): Observable<any[]> {
    console.log('Searching for faculty:', faculty); // Debugging line
    return this.firestore
      .collection('studentProfile', ref => ref.where('faculty', '==', faculty))
      .valueChanges()
      .pipe(
        tap(results => console.log('Query results:', results)) // Log the results
      );
  }
  

  applySecondFilter(course: string): Observable<any[]> {
    return this.firestore
      .collection('studentProfile', ref => ref.where('course', '==', course))
      .valueChanges();
  }

  levelFilter(level: string, faculty: string, crs: string): Observable<any[]> {
    let query = this.firestore.collection('studentProfile', ref => {
      let result: any = ref;

      if (level) {
        result = result.where('level', '==', level).where('status', '==', 'placed');
      }

      if (faculty) {
        result = result.where('faculty', '==', faculty);
      }

      if (crs) {
        result = result.where('course', '==', crs);
      }

      return result;
    });
    
    return query.valueChanges();
  }

  avgFilter(gradeAverage: string, crs: string): Observable<any[]> {
    const lowerRange = Number(gradeAverage);
    const upperRange = lowerRange + 9;

    let query = this.firestore.collection('studentProfile', ref => {
      let result: any = ref.where('status', '==', 'placed');

      if (crs) {
        result = result.where('course', '==', crs);
      }

      return result;
    });

    return new Observable(observer => {
      query.valueChanges().subscribe((data: any[]) => {
        const filteredData = data.filter((student) => {
          const studentGradeAverage = Number(student.gradeAverage);
          return studentGradeAverage >= lowerRange && studentGradeAverage <= upperRange;
        });
        observer.next(filteredData);
      });
    });
  }


  filterStudents(level?: string, faculty?: string, course?: string, status?: string, genderbase?: string, studentno?: string) {
    return this.firestore.collection('studentProfile', ref => {
      let query: any = ref;

      if (level) {
        query = query.where('level', '==', level);
      }

      if (faculty) {
        query = query.where('faculty', '==', faculty);
      }

      if (course) {
        query = query.where('course', '==', course);
      }

      if (status) {
        query = query.where('status', '==', status);
      }

      if (genderbase) {
        query = query.where('gender', '==', genderbase);
      }

      if (studentno) {
        query = query.where('studentno', '==', studentno);
      }

      return query;
    }).valueChanges();
  }

 
  filterByYear(selectedYear: number) {
    return this.firestore.collection('studentProfile', ref => ref
      .where('createdAt', '>=', new Date(selectedYear, 0, 1))
      .where('createdAt', '<=', new Date(selectedYear, 11, 31))
    ).valueChanges();
  }
  
}
