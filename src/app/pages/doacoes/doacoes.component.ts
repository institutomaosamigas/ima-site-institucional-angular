import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';

@Component({
  selector: 'app-doacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './doacoes.component.html',
  styleUrl: './doacoes.component.scss',
})
export class DoacoesComponent {
  @ViewChildren('valorBtn') valorButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  valorAtual: number = 0;
  valorPersonalizado: number = 0;
  botaoSelecionado: number | null = null;
  valorCustomSelecionado: boolean = false;
  tipoDoacao: 'avulsa' | 'recorrente' = 'avulsa';
  planoSelecionado: 'semente' | 'crescimento' | 'transformacao' | null = null;
  metodoSelecionado: 'paypal' | 'pix' = 'paypal';
  valoresPreDefinidos: number[] = [10, 25, 50, 100, 200];

  planos = [
    {
      id: 'semente' as const,
      nome: 'Semente',
      valor: 30,
      descricao: 'Apoio essencial para iniciar transformações',
    },
    {
      id: 'crescimento' as const,
      nome: 'Crescimento',
      valor: 50,
      descricao: 'Amplie o impacto dos nossos atendimentos',
    },
    {
      id: 'transformacao' as const,
      nome: 'Transformação',
      valor: 100,
      descricao: 'Seja parceiro na mudança de vidas',
    },
  ];

  carregando: boolean = false;
  mensagemErro: string = '';

  private baseApi =
    'https://3imdkv3u35sj4p2sevuwfjbru40afuzv.lambda-url.us-east-1.on.aws';

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.configurarEventosBotoes();
  }

  private configurarEventosBotoes(): void {
    this.valorButtons.forEach((botaoRef) => {
      const botao = botaoRef.nativeElement;

      botao.addEventListener('keydown', (event: KeyboardEvent) => {
        this.manipularTecladoValor(event, botao);
      });
    });
  }

  selecionarValor(valor: number, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.valorAtual = valor;
    this.valorPersonalizado = valor;
    this.botaoSelecionado = valor;
    this.valorCustomSelecionado = false;
    this.tipoDoacao = 'avulsa';
    this.planoSelecionado = null;

    this.anunciarMudanca(`Valor selecionado: R$ ${valor}`);
  }

  selecionarPlano(plano: 'semente' | 'crescimento' | 'transformacao'): void {
    this.tipoDoacao = 'recorrente';
    this.planoSelecionado = plano;
    const planoData = this.planos.find((p) => p.id === plano);
    if (planoData) {
      this.valorAtual = planoData.valor;
      this.valorPersonalizado = planoData.valor;
      this.botaoSelecionado = null;
      this.anunciarMudanca(
        `Plano ${planoData.nome} selecionado: R$ ${planoData.valor}/mês`
      );
    }
  }

  onValorPersonalizadoChange(): void {
    this.valorAtual = this.valorPersonalizado;
    this.tipoDoacao = 'avulsa';
    this.planoSelecionado = null;

    const botoes = [10, 50, 200];
    if (botoes.includes(this.valorPersonalizado)) {
      this.botaoSelecionado = this.valorPersonalizado;
      this.valorCustomSelecionado = false;
    } else {
      this.botaoSelecionado = null;
      this.valorCustomSelecionado = true;
    }
  }

  onCustomInputFocus(): void {
    this.valorCustomSelecionado = true;
    this.botaoSelecionado = null;
  }

  validarValorMinimo(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = parseFloat(input.value);

    if (!isNaN(valor)) {
      valor = Math.floor(valor * 100) / 100;
      this.valorPersonalizado = valor;
      this.valorAtual = valor;
    }

    if (valor > 0 && valor < 1) {
      this.mensagemErro = 'O valor mínimo para doação é R$ 1,00';
    } else if (valor >= 1) {
      this.mensagemErro = '';
    } else if (valor === 0 || isNaN(valor)) {
      this.mensagemErro = '';
      this.valorPersonalizado = 0;
      this.valorAtual = 0;
    }
  }

  bloquearDecimais(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      return;
    }

    if (valor.includes('.') || valor.includes(',')) {
      const partes = valor.split(/[.,]/);
      if (partes[1] && partes[1].length >= 2) {
        event.preventDefault();
      }
    }
  }

  formatarValor(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = parseFloat(input.value);

    if (!isNaN(valor) && valor > 0) {
      valor = Math.floor(valor * 100) / 100;
      this.valorPersonalizado = valor;
      this.valorAtual = valor;
      input.value = valor.toFixed(2);
    }
  }

  private manipularTecladoValor(
    event: KeyboardEvent,
    botao: HTMLButtonElement
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const valor = parseInt(botao.getAttribute('data-valor') || '0');
      this.selecionarValor(valor);
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.valorPersonalizado = 0;
      this.valorAtual = 0;
      this.botaoSelecionado = null;
    }
  }

  private anunciarMudanca(mensagem: string): void {
    console.log('Leitor de tela:', mensagem);
  }

  copiarChavePix(): void {
    const chavePix = 'contato@imasaoamg.org.br';
    navigator.clipboard
      .writeText(chavePix)
      .then(() => {
        alert('Chave PIX copiada com sucesso!');
      })
      .catch((err) => {
        console.error('Erro ao copiar chave PIX:', err);
      });
  }

  resetarValores(): void {
    this.valorAtual = 0;
    this.valorPersonalizado = 0;
    this.botaoSelecionado = null;
    this.valorCustomSelecionado = false;
  }

  criarDoacao(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.valorAtual < 1 && this.tipoDoacao === 'avulsa') {
      this.mensagemErro = 'Por favor, selecione um valor mínimo de R$ 1,00';
      return;
    }

    if (this.tipoDoacao === 'recorrente' && !this.planoSelecionado) {
      this.mensagemErro =
        'Por favor, selecione um plano para doação recorrente';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let body: any;

    if (this.tipoDoacao === 'avulsa') {
      const valorNumerico = parseFloat(this.valorAtual.toString());
      body = {
        tipo: 'avulsa',
        valor: valorNumerico,
      };
      console.log('🔵 Criando doação avulsa:');
      console.log(
        '   - Valor:',
        valorNumerico,
        '(tipo:',
        typeof valorNumerico + ')'
      );
    } else if (this.tipoDoacao === 'recorrente' && this.planoSelecionado) {
      body = {
        tipo: 'recorrente',
        plano: this.planoSelecionado,
      };
      console.log('🟣 Criando assinatura recorrente:');
      console.log('   - Plano:', this.planoSelecionado);
      const planoInfo = this.planos.find((p) => p.id === this.planoSelecionado);
      if (planoInfo) {
        console.log('   - Valor do plano: R$', planoInfo.valor + '/mês');
      }
    } else {
      console.error('❌ Tipo de doação inválido ou plano não selecionado');
      this.mensagemErro = 'Por favor, selecione um tipo de doação válido';
      this.carregando = false;
      return;
    }

    console.log('📤 Body da requisição:', JSON.stringify(body, null, 2));
    console.log('🌐 URL da API:', `${this.baseApi}/doacoes/criar`);

    this.http
      .post<any>(`${this.baseApi}/doacoes/criar`, body, { headers })
      .subscribe({
        next: (response) => {
          this.carregando = false;

          console.log('Resposta completa da API:', response);

          if (response.sucesso && response.dados?.approveLink) {
            console.log('Redirecionando para:', response.dados.approveLink);
            window.location.href = response.dados.approveLink;
          } else {
            this.mensagemErro =
              'Não foi possível obter o link de pagamento. Tente novamente.';
            console.error('Link não encontrado na resposta:', response);
          }
        },
        error: (error) => {
          this.carregando = false;
          console.error('Erro ao criar doação:', error);
          console.error('Detalhes do erro:', error.error);

          let mensagemErro = 'Erro ao processar doação. Tente novamente.';

          if (error.error?.mensagem) {
            mensagemErro = error.error.mensagem;
          } else if (error.error?.message) {
            mensagemErro = error.error.message;
          } else if (error.message) {
            mensagemErro = error.message;
          }

          this.mensagemErro = mensagemErro;
        },
      });
  }

  isBotaoSelecionado(valor: number): boolean {
    return this.botaoSelecionado === valor;
  }

  isPlanoSelecionado(plano: string): boolean {
    return this.planoSelecionado === plano;
  }
}
