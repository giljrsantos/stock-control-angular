import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { IAuthRequest } from '@app/models/interfaces/user/auth/i-AuthRequest';
import { IAuthResponse } from '@app/models/interfaces/user/auth/i-AuthResponse';
import { ISignupUserRequest } from '@app/models/interfaces/user/i-SignupUserRequest';
import { ISignupUserResponse } from '@app/models/interfaces/user/i-SignupUserResponse';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {}

  signupUser(
    requestDatas: ISignupUserRequest,
  ): Observable<ISignupUserResponse> {
    return this.http.post<ISignupUserResponse>(
      `${this.API_URL}/user`,
      requestDatas,
    );
  }

  authUser(
    requestDatas: IAuthRequest,
  ): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(
      `${this.API_URL}/auth`,
      requestDatas,
    );
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
