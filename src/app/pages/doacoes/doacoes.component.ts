import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doacoes.component.html',
  styleUrl: './doacoes.component.scss'
})
export class DoacoesComponent {
  @ViewChildren('valorBtn') valorButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  
  valorAtual: number = 0;
  valorPersonalizado: number = 0;
  botaoSelecionado: number | null = null;

  ngAfterViewInit(): void {
    // Configurar eventos dos botões após a view ser inicializada
    this.configurarEventosBotoes();
  }

  private configurarEventosBotoes(): void {
    this.valorButtons.forEach(botaoRef => {
      const botao = botaoRef.nativeElement;
      
      // Já temos o (click) no template, mas podemos adicionar eventos de teclado aqui se necessário
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
    
    // Anunciar mudança para leitores de tela
    this.anunciarMudanca(`Valor selecionado: R$ ${valor}`);
  }

  onValorPersonalizadoChange(): void {
    this.valorAtual = this.valorPersonalizado;
    this.botaoSelecionado = null;
    
    // Verificar se corresponde a algum botão
    const botoes = [10, 25, 50, 100, 200];
    if (botoes.includes(this.valorPersonalizado)) {
      this.botaoSelecionado = this.valorPersonalizado;
    }
  }

  private manipularTecladoValor(event: KeyboardEvent, botao: HTMLButtonElement): void {
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
    // Em um ambiente real, você pode usar um serviço de anúncio para leitores de tela
    console.log('Leitor de tela:', mensagem);
    
    // Alternativa: usar Live Announcer do Angular CDK se disponível
    // this.liveAnnouncer.announce(mensagem);
  }

  // Métodos para os botões de pagamento
  doarComPaypal(event: Event): void {
    event.preventDefault();
    // Lógica para redirecionar para PayPal
    console.log('Redirecionando para PayPal com valor:', this.valorAtual);
  }

  doarComCartao(event: Event): void {
    event.preventDefault();
    // Lógica para redirecionar para pagamento com cartão
    console.log('Redirecionando para pagamento com cartão com valor:', this.valorAtual);
  }

  isBotaoSelecionado(valor: number): boolean {
    return this.botaoSelecionado === valor;
  }
}
