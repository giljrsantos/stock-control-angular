import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { IAuthRequest } from '@app/models/interfaces/user/auth/i-AuthRequest';
import { ISignupUserRequest } from '@app/models/interfaces/user/i-SignupUserRequest';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '@app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy, AfterViewInit {

  @ViewChild('emailInput') public emailInputRef!: ElementRef
  @ViewChild('passwordInput') public passwordInputRef!: ElementRef

  private destroy$ = new Subject<void>();

  loginCard: boolean = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
  ) { }
  ngAfterViewInit(): void {
    this.emailInputRef.nativeElement.value = 'Seu Email Aqui';
    this.passwordInputRef.nativeElement.value = 'Sua Senha aqui'
    console.log('EMAIL INPUT', this.emailInputRef.nativeElement.value);
    console.log('PASSWORD INPUT', this.passwordInputRef.nativeElement.value);
  }

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService
        .authUser(this.loginForm.value as IAuthRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set(
                'USER_INFO',
                response?.token,
              );
              this.loginForm.reset();
              this.router.navigate(['/dashboard']);
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}`,
                life: 5000,
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer login!`,
              life: 5000,
            });
            console.log(err);
          },
        });
    }
  }

  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      this.userService
        .signupUser(
          this.signupForm.value as ISignupUserRequest,
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.signupForm.reset();
              this.loginCard = true;
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Usuário ${response.name} criado com sucesso!`,
                life: 5000,
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar usuário!`,
              life: 5000,
            });
            console.log(err);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
