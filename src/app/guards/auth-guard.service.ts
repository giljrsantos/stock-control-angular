import { Router, UrlTree } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '@app/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private userservice: UserService,
    private router: Router,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.userservice.isLoggedIn()) {
      this.router.navigate(['/home']);
      return false;
    }

    this.userservice.isLoggedIn();
    return true;
  }
}
