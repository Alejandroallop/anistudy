import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  selectedAvatar: string = 'hana'; // Avatar por defecto

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

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializar formulario reactivo
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = {
      name: this.loginForm.value.name,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      avatar: this.selectedAvatar
    };

    console.log('Login con:', credentials);

    // Guardar nombre en localStorage para el dashboard
    localStorage.setItem('userName', credentials.name);

    // TODO: Implementar llamada al servicio de autenticación
    // this.authService.login(credentials).subscribe(...)

    // Redirigir al dashboard
    this.router.navigate(['/dashboard']);
  }

  /**
   * Login como usuario demo (Sakura)
   */
  onDemoLogin(): void {
    const demoCredentials = {
      email: 'demo@anistudy.com',
      password: '123456',
      avatar: this.selectedAvatar
    };

    console.log('Login DEMO con:', demoCredentials);

    // TODO: Implementar llamada al servicio de autenticación con credenciales demo
    // this.authService.login(demoCredentials).subscribe(...)

    // Por ahora, redirigir al dashboard (temporal)
    // this.router.navigate(['/dashboard']);
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
