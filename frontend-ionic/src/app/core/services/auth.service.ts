import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);

  private backendUrl = `${environment.apiNode}/users`;

  public user$ = user(this.auth);
  public currentUser = toSignal(this.user$);

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  public isSystemAdmin = toSignal(this.isAdmin$, { initialValue: false });

  constructor() {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'admin') {
      this.isAdminSubject.next(true);
    }
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );

    if (email.toLowerCase() === 'admin@gmail.com') {
      this.isAdminSubject.next(true);
      localStorage.setItem('userRole', 'admin'); 
    } else {
      this.isAdminSubject.next(false);
      localStorage.removeItem('userRole');
    }

    return userCredential.user.getIdToken();
  }

  async registerInFirebaseAndBackend(
    email: string,
    password: string,
  ): Promise<any> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );

    this.isAdminSubject.next(false);
    localStorage.removeItem('userRole');

    try {
      const idToken = await userCredential.user.getIdToken();
      const fallbackUsername = email.split('@')[0];

      const backendData = {
        username: fallbackUsername,
        email: email,
        password: password,
        role: 'user',
      };

      return await firstValueFrom(
        this.http.post(`${this.backendUrl}/register`, backendData, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
      );
    } catch (e) {
      console.warn(
        'Backend Node inaccesible, usuario creado solo en Firebase Auth.',
        e,
      );
      return userCredential.user;
    }
  }
    async getActiveToken(): Promise<string | null> {
      if (this.auth.currentUser) {
        return await this.auth.currentUser.getIdToken();
      }
      return null;
    }
  async logout() {
    this.isAdminSubject.next(false);
    localStorage.removeItem('userRole'); 
    return signOut(this.auth);
  }

  getUID() {
    return this.auth.currentUser?.uid;
  }

  isUserAdmin(): boolean {
    return (
      this.isAdminSubject.value || localStorage.getItem('userRole') === 'admin'
    );
  }
}
