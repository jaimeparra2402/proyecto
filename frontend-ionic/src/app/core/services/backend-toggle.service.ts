import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type BackendType = 'NODE' | 'JAVA';

@Injectable({
  providedIn: 'root'
})
export class BackendToggleService {
  private currentBackend = new BehaviorSubject<BackendType>(
    (localStorage.getItem('backend') as BackendType) || 'NODE'
  );
  backend$ = this.currentBackend.asObservable();

  setBackend(type: BackendType) {
    localStorage.setItem('backend', type);
    this.currentBackend.next(type);
  }

  getBackend(): BackendType {
    return this.currentBackend.value;
  }
}