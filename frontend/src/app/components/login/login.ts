import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  selectedAvatar = 'hana'; // Avatar por defecto

  // Array de avatares disponibles
  avatars = [
    {
      id: 'hana',
      name: 'Hana',
      role: 'Guerrera',
      image: '/assets/images/avatar.png'
    },
    {
      id: 'kenji',
      name: 'Kenji',
      role: 'Samurái',
      image: '/assets/images/avatar-kenji.png'
    }
  ];

  isLoginMode = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializar formulario reactivo
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      name: [''], // Validación dinámica
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // Inicializar estado del campo nombre
    this.updateNameValidator();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.updateNameValidator();
  }

  private updateNameValidator(): void {
    const nameControl = this.loginForm.get('name');
    if (this.isLoginMode) {
      nameControl?.clearValidators();
      nameControl?.disable();
    } else {
      nameControl?.setValidators([Validators.required, Validators.minLength(2)]);
      nameControl?.enable();
    }
    nameControl?.updateValueAndValidity();
  }

  /**
   * Seleccionar avatar
   */
  selectAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
    console.log('Avatar seleccionado:', avatar);
  }

  /**
   * Login normal
   */
  onSubmit(): void {
    console.log('✅ Botón pulsado, procesando modo:', this.isLoginMode);

    if (this.loginForm.invalid) {
      console.warn('⚠️ Formulario inválido:', this.loginForm);
      Object.keys(this.loginForm.controls).forEach(key => {
        const controlErrors = this.loginForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Error en campo ${key}:`, controlErrors);
        }
      });
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const formValue = this.loginForm.value;
    let authObs;

    if (this.isLoginMode) {
      authObs = this.authService.login({
        email: formValue.email,
        password: formValue.password
      });
    } else {
      const selectedAvatarObj = this.avatars.find(a => a.id === this.selectedAvatar);
      authObs = this.authService.register({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        avatar: selectedAvatarObj ? selectedAvatarObj.image : '/assets/images/avatar.png',
        // Default values
        level: 1,
        xp: 0
      });
    }

    authObs.subscribe({
      next: (res) => {
        console.log('Auth exitoso:', res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error Auth:', err);
        this.errorMessage = err.error?.message || 'Ocurrió un error. Intenta nuevamente.';
      }
    });
  }


  /**
   * Obtener control del formulario para validaciones
   */
  get name() {
    return this.loginForm.get('name');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
