import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private firestore: AngularFirestore) { }

  filter(
    faculty: string,
    crs: string,
    genderbase: string,
    gradeAverage: string,
    selectedMunicipality: string,
    selectedProvince: string,
    selectedMaspala: string
  ): Observable<any[]> {
    
    return this.firestore.collection('studentProfile', (ref) => {
      let query: any = ref.where('status', '==', 'active').where('level', '==', 'EMPLOYMENT');

      if (faculty) {
        query = query.where('faculty', '==', faculty);
      }

      if (crs) {
        query = query.where('course', '==', crs);
      }

      if (genderbase) {
        query = query.where('gender', '==', genderbase);
      }

      if (gradeAverage) {
        const minGrade = Number(gradeAverage);
        const maxGrade = minGrade + 10;
        query = query.where('gradeAverage', '>=', minGrade).where('gradeAverage', '<', maxGrade);
      }

      if (selectedMunicipality) {
        query = query.where('municipality', '==', selectedMunicipality);
      }

      if (selectedProvince) {
        query = query.where('provice', '==', selectedProvince);
      }

      if (selectedMaspala) {
        query = query.where('municipality', '==', selectedMaspala);
      }

      return query;
    }).valueChanges();
  }
 

  applyFilterPlaced(faculty: string): Observable<any[]> {
    console.log('Applying filter with faculty:', faculty); // Debugging line
    return this.firestore.collection('studentProfile', ref =>
      ref.where('faculty', '==', faculty)
         .where('status', '==', 'placed')
    ).valueChanges();
  }

  applySecondFilterPlaced(course: string): Observable<any[]> {
    console.log('Applying second filter with course:', course); // Debugging line
    return this.firestore.collection('studentProfile', ref =>
      ref.where('course', '==', course)
         .where('status', '==', 'placed')
    ).valueChanges();
  }

  levelFilterPlaced(level?: string, faculty?: string, course?: string): Observable<any[]> {
    console.log('Applying level filter with level:', level, 'faculty:', faculty, 'course:', course); // Debugging line
    let query = this.firestore.collection('studentProfile', ref => {
      let result = ref.where('status', '==', 'placed');

      if (level) {
        result = result.where('level', '==', level);
      }
      if (faculty) {
        result = result.where('faculty', '==', faculty);
      }
      if (course) {
        result = result.where('course', '==', course);
      }

      return result;
    });

    return query.valueChanges();
  }

 

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
        result = result.where('level', '==', level);
      }
  
      if (faculty) {
        result = result.where('faculty', '==', faculty);
      }
  
      if (crs) {
        result = result.where('course', '==', crs);
      }
  
      
      result = result.where('status', '==', 'placed'); 
  
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
  

  filterByFacultyAndStatus(faculty: string, status: string): Observable<any[]> {
    return this.firestore
      .collection('studentProfile', ref => ref.where('faculty', '==', faculty).where('status', '==', status))
      .valueChanges();
  }

  filterByCourseAndStatus(course: string, status: string): Observable<any[]> {
    return this.firestore
      .collection('studentProfile', ref => ref.where('course', '==', course).where('status', '==', status))
      .valueChanges();
  }

  filterByLevelFacultyCourse(level?: string, faculty?: string, course?: string): Observable<any[]> {
    return this.firestore.collection('studentProfile', ref => {
      let query: any = ref.where('status', '==', 'recommended');

      if (level) {
        query = query.where('level', '==', level);
      }

      if (faculty) {
        query = query.where('faculty', '==', faculty);
      }

      if (course) {
        query = query.where('course', '==', course);
      }

      return query;
    }).valueChanges();
  }

  filterByGradeRange(course?: string, gradeAverage?: string): Observable<any[]> {
    if (!gradeAverage) {
      return new Observable((observer) => observer.next([]));
    }

    const lowerRange = Number(gradeAverage);
    const upperRange = lowerRange + 9;

    return this.firestore.collection('studentProfile', ref => {
      let query: any = ref.where('status', '==', 'recommended');

      if (course) {
        query = query.where('course', '==', course);
      }

      return query;
    }).valueChanges();
  }

  filterDataByGradeRange(data: any[], gradeAverage: string): any[] {
    const lowerRange = Number(gradeAverage);
    const upperRange = lowerRange + 9;

    return data.filter(student => {
      const studentGradeAverage = Number(student.gradeAverage);
      return studentGradeAverage >= lowerRange && studentGradeAverage <= upperRange;
    });
  }

  getFilteredData(
    faculty: string,
    crs: string,
    genderbase: string,
    gradeAverage: string,
    selectedMunicipality: string,
    selectedProvince: string,
    selectedMaspala: string
  ): Observable<any[]> {
    return this.firestore.collection('studentProfile', (ref) => {
      let filteredQuery = ref.where('status', '==', 'active').where('level', '==', 'WIL');

      if (faculty !== '') {
        filteredQuery = filteredQuery.where('faculty', '==', faculty);
      }

      if (crs !== '') {
        filteredQuery = filteredQuery.where('course', '==', crs);
      }

      if (genderbase !== '') {
        filteredQuery = filteredQuery.where('gender', '==', genderbase);
      }

      if (gradeAverage !== '') {
        const minGrade = Number(gradeAverage);
        const maxGrade = minGrade + 10;
        filteredQuery = filteredQuery.where('gradeAverage', '>=', minGrade).where('gradeAverage', '<', maxGrade);
      }

      if (selectedMunicipality !== '') {
        filteredQuery = filteredQuery.where('municipality', '==', selectedMunicipality);
      }

      if (selectedProvince !== '') {
        filteredQuery = filteredQuery.where('province', '==', selectedProvince);
      }

      if (selectedMaspala !== '') {
        filteredQuery = filteredQuery.where('municipality', '==', selectedMaspala);
      }

      return filteredQuery;
    }).valueChanges();
  }
}
