import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seja-voluntario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seja-voluntario.component.html',
  styleUrl: './seja-voluntario.component.scss'
})
export class SejaVoluntarioComponent {
  volunteerForm: FormGroup;
  curriculoFile: File | null = null;
  showSuccess: boolean = false;
  
  constructor(private fb: FormBuilder, private router: Router) {
    this.volunteerForm = this.fb.group({
      nome: ['', Validators.required],
      maior18: [false, Validators.requiredTrue],
      cpf: ['', [Validators.required, Validators.minLength(14)]], // 14 = 11 dígitos + 2 pontos + 1 traço
      cidadeEstado: ['', Validators.required],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      profissao: ['', Validators.required],
      setorInteresse: ['', Validators.required],
      contribuicao: ['', Validators.required],
      disponibilidadeHoras: ['', [Validators.required, Validators.min(1)]],
      tipoDisponibilidade: ['', Validators.required],
      linkedin: [''],
      portfolio: [''],
    });
  }

  // máscara para telefone
  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      event.target.value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      event.target.value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else {
      event.target.value = value.replace(/^(\d*)/, '($1');
    }
    this.volunteerForm.get('whatsapp')?.setValue(event.target.value, { emitEvent: false });
  }

  isInvalid(field: string): boolean {
    const control = this.volunteerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.volunteerForm.valid) {
      const formData = this.volunteerForm.value;

      fetch('https://formspree.io/f/xrborngr', { // substitua pela sua URL
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email
        })
      }).then(response => {
          if (response.ok) {
            this.scrollToTop();

              // exibe o alerta de sucesso
            this.showSuccess = true;
            setTimeout(() => {
              this.showSuccess = false;
              this.volunteerForm.reset();
            }, 4000); // 4 segundos
            
            this.curriculoFile = null;
          } else {
            alert('Erro ao enviar. Tente novamente.');
          }
        })
      .catch(() => alert('Erro na conexão. Tente novamente.'));
    }
    else {
      this.volunteerForm.markAllAsTouched();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.curriculoFile = file;
    }
  }

  scrollToTop() {
    this.router.navigate(['/seja-voluntario']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatCPF(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // remove tudo que não é número

    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

    input.value = value;
    this.volunteerForm.get('cpf')?.setValue(value, { emitEvent: false });
  }
}