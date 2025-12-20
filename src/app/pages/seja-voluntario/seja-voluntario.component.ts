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
      maioridade: [false, Validators.requiredTrue],
      cpf: ['', [Validators.required, Validators.minLength(14)]], // 14 = 11 dígitos + 2 pontos + 1 traço
      localizacao: ['', Validators.required],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      profissao: ['', Validators.required],
      setorInteresse: ['', Validators.required],
      contribuicao: ['', Validators.required],
      disponibilidadeHoras: ['', [Validators.required, Validators.min(1)]],
      modeloDeTrabalho: ['', Validators.required],
      linkedin: [''],
      portfolio: [''],
      curriculoBase64: [''],
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

      fetch('https://olh6eduueqtdx7myc4es5ql56y0qbftq.lambda-url.us-east-1.on.aws/candidatos', { // substitua pela sua URL
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        nome: formData.nome,
        maioridade: formData.maioridade,
        cpf: formData.cpf,
        localizacao: formData.localizacao,
        whatsapp: formData.whatsapp,
        email: formData.email,
        profissao: formData.profissao,
        setorInteresse: formData.setorInteresse,
        contribuicao: formData.contribuicao,
        disponibilidadeHoras: Number(formData.disponibilidadeHoras),
        modeloDeTrabalho: formData.modeloDeTrabalho,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
        curriculoBase64: formData.curriculoBase64
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

  convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = () => reject();
    reader.readAsDataURL(file);
    });
  }
}