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

  // Un BehaviorSubject para saber el rol en tiempo real en la app
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    
    // Obtenemos el token y forzamos el refresco para leer los roles (claims)
    const idTokenResult = await userCredential.user.getIdTokenResult(true);
    
    // Hardcodeamos tu cuenta de administrador aquí para la defensa si no usas el backend de Node,
    // o leemos el claim personalizado si lo configuraste en Firebase Console
    if (email === 'admin@futbolapp.com' || idTokenResult.claims['role'] === 'admin') {
      this.isAdminSubject.next(true);
    } else {
      this.isAdminSubject.next(false);
    }

    return userCredential.user.getIdToken(); 
  }

  async registerInFirebaseAndBackend(username: string, email: string, password: string): Promise<any> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    // Todos los usuarios nuevos serán normales
    this.isAdminSubject.next(false);

    // Omitimos la llamada al backend de Node temporalmente si está apagado
    try {
      const idToken = await userCredential.user.getIdToken();
      const backendData = {
        username: username,
        password: password,
        role: 'user'
      };
      return await firstValueFrom(
        this.http.post(`${this.backendUrl}/register`, backendData, {
          headers: { Authorization: `Bearer ${idToken}` }
        })
      );
    } catch (e) {
      console.warn('Backend Node inaccesible, usuario creado solo en Firebase Auth.');
      return userCredential.user;
    }
  }

  async logout() {
    this.isAdminSubject.next(false);
    return signOut(this.auth);
  }

  getUID() {
    return this.auth.currentUser?.uid;
  }

  // Método rápido para comprobar de forma síncrona en las vistas de la app
  isUserAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}