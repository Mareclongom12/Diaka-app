import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmation = control.get('password_confirmation')?.value;
  return password === confirmation ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator }
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { name, email, password, password_confirmation } = this.form.getRawValue();

    this.authService.register(name, email, password, password_confirmation).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(this.extractErrorMessage(err));
      },
    });
  }

  private extractErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return this.translate.instant('REGISTER.ERROR_NETWORK');
    }
    if (err.status === 422) {
      const errors = err.error?.errors;
      if (errors?.email) {
        return this.translate.instant('REGISTER.ERROR_EMAIL_TAKEN');
      }
      const firstError = errors ? Object.values(errors)[0] : null;
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0] as string;
      }
      return this.translate.instant('REGISTER.ERROR_INVALID');
    }
    return this.translate.instant('REGISTER.ERROR_GENERIC');
  }
}
