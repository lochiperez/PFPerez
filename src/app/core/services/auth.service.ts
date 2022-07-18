import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { selectUsersSuccess } from 'src/app/store/features/users/users.selector';
import { AuthUser } from '../interfaces/authUser.interface';
import { User } from '../../users/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = 'https://62b113b1196a9e98702f186f.mockapi.io/users/';

  userData: User | null = {
    id: 1,
    username: 'admin',
    name: 'Rodrigo',
    lastname: 'Perez', 
    rol: 'admin'
  };

  authUser: AuthUser = {
    isAuth: false,
    userData: null
  };

  constructor(
    private _http: HttpClient,
    private store: Store
  ) { }

  private handleError(error: HttpErrorResponse) {
    //Manejo de errores http frontend
    if(error) {
      console.warn(`Error de backend: ${error.status}, cuerpo del error: ${error.message}`);
    }
    return throwError('Error de comunicación Http');
  }


  getAuthUser(): Observable<AuthUser> {
    return of(this.authUser);
  }

  setIsLoggedIn(isLogged: boolean, user: User | null) {
    if(user) {
      this.authUser = {
        isAuth: isLogged,
        userData: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          username: user.username,
          rol: user.rol
        } 
      };
    } else {
      this.authUser = {
        isAuth: isLogged,
        userData: user
      };
    }
  }

  logOut(): Observable<boolean> {
    this.authUser = {
      isAuth: false,
      userData: null
    };
    return of(true);
  }

  getUserData():Observable<User | null> {
    return of(this.userData);
  }

  login(username: string, password:string): Observable<AuthUser> {
    this.store.select(selectUsersSuccess).subscribe((usersData) => {
      const users = usersData.users;
      let user = users.find((usr) => usr.username === username);
      if(user && user.password === password) {
        this.setIsLoggedIn(true, user);
      } else {
        this.setIsLoggedIn(false, null);
      }
    });
    return this.getAuthUser();
  }

  

}
