import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import { cerrarUsuariosSuccess } from '../../store/actions/usuarios.actions';

import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formSubmitted = false;
  auth2: any;
  loginForm: FormGroup = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [
        Validators.required,
        Validators.pattern(
          '^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$'
        ),
      ],
    ],
    password: ['', Validators.required],
    remember: [localStorage.getItem('remember') || false],
  });

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private store: Store<AppState>,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(cerrarUsuariosSuccess());
    this.renderButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  login() {
    this.usuarioService
      .login(this.loginForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: string) => {
          if (this.loginForm.get('remember').value) {
            localStorage.setItem('email', this.loginForm.get('email').value);
            localStorage.setItem(
              'remember',
              this.loginForm.get('remember').value
            );
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('remember');
          }
          this.router.navigateByUrl('/');
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });
    this.startApp();
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService
          .loginGoogle(id_token)
          .pipe(takeUntil(this.destroy$))
          .subscribe((resp) =>
            this.ngZone.run(() => this.router.navigateByUrl('/'))
          );
      },
      (error) => {
        Swal.fire('Error', JSON.stringify(error, undefined, 2), 'error');
      }
    );
  }
}
