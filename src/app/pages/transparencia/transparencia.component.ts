import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transparencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transparencia.component.html',
  styleUrl: './transparencia.component.scss'
})
export class TransparenciaComponent implements AfterViewInit, OnDestroy {

  @ViewChild('grid', { static: false }) gridRef!: ElementRef<HTMLDivElement>;
  @ViewChild('filtroOrdem', { static: false }) selectOrdemRef!: ElementRef<HTMLSelectElement>;
  @ViewChild('filtroAno', { static: false }) inputAnoRef!: ElementRef<HTMLInputElement>;
  @ViewChild('btnBuscar', { static: false }) btnBuscarRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnLimpar', { static: false }) btnLimparRef!: ElementRef<HTMLButtonElement>;

  private cards: HTMLElement[] = [];
  private boundSort!: (order: string) => void;
  private boundFilter!: (year: string) => void;

  // Variáveis para acessibilidade
  relatoriosFiltrados: number = 0;
  mensagemResultados: string = '';
  private resultadosElement: HTMLElement | null = null;

  ngAfterViewInit(): void {
    // proteção caso o template ainda não tenha sido renderizado no cliente
    if (!this.gridRef) return;

    const grid = this.gridRef.nativeElement;
    this.cards = Array.from(grid.querySelectorAll<HTMLElement>('.relatorio-card'));
    this.relatoriosFiltrados = this.cards.length;

    // Elemento para mensagens de acessibilidade
    this.resultadosElement = document.getElementById('nenhum-resultado');

    const selectOrdem = this.selectOrdemRef?.nativeElement;
    const inputAno = this.inputAnoRef?.nativeElement;
    const btnBuscar = this.btnBuscarRef?.nativeElement;
    const btnLimpar = this.btnLimparRef?.nativeElement;

    // funções puras
    this.boundSort = (order: string) => {
      const sorted = this.cards.slice().sort((a, b) => {
        const ay = parseInt(a.dataset['year'] ?? '0', 10);
        const by = parseInt(b.dataset['year'] ?? '0', 10);
        return order === 'asc' ? ay - by : by - ay;
      });
      grid.innerHTML = '';
      sorted.forEach(c => grid.appendChild(c));
      this.atualizarMensagemResultados();
    };

    this.boundFilter = (year: string) => {
      const target = parseInt(year, 10);
      let cardsVisiveis = 0;
      
      this.cards.forEach(c => {
        const y = parseInt(c.dataset['year'] ?? '0', 10);
        const isVisible = !year || Number.isNaN(target) ? true : (y === target);
        c.style.display = isVisible ? 'block' : 'none';
        if (isVisible) cardsVisiveis++;
      });

      this.relatoriosFiltrados = cardsVisiveis;
      this.atualizarMensagemResultados();
      this.atualizarMensagemNenhumResultado(cardsVisiveis);
      this.anunciarResultados(cardsVisiveis, year);
    };

    // ligar eventos com proteção (existência das refs)
    if (selectOrdem) {
      selectOrdem.addEventListener('change', () => this.boundSort(selectOrdem.value));
    }
    if (inputAno) {
      inputAno.addEventListener('input', (event: Event) => {
        const input = event.target as HTMLInputElement;
        this.boundFilter(input.value);
      });
      
      // Evento de teclado para acessibilidade
      inputAno.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.boundFilter(inputAno.value);
        }
      });
    }
    if (btnBuscar) {
      btnBuscar.addEventListener('click', () => this.boundFilter(inputAno?.value ?? ''));
    }
    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
        if (inputAno) inputAno.value = '';
        this.boundFilter('');
        this.anunciarMudanca('Filtros limpos. Mostrando todos os relatórios.');
      });
    }

    // Configurar eventos de teclado para os cards
    this.configurarEventosCards();

    // inicializa com mais novo → mais antigo
    this.boundSort('desc');
    this.atualizarMensagemResultados();
  }

  private configurarEventosCards(): void {
    this.cards.forEach(card => {
      card.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          // Simular clique no link
          const link = card as HTMLAnchorElement;
          if (link.href) {
            window.open(link.href, '_blank');
          }
        }
      });
    });
  }

  private atualizarMensagemResultados(): void {
    const quantidade = this.relatoriosFiltrados;
    this.mensagemResultados = `${quantidade} relatório${quantidade !== 1 ? 's' : ''} encontrado${quantidade !== 1 ? 's' : ''}`;
  }

  private atualizarMensagemNenhumResultado(cardsVisiveis: number): void {
    if (this.resultadosElement) {
      if (cardsVisiveis === 0) {
        this.resultadosElement.classList.remove('hidden');
      } else {
        this.resultadosElement.classList.add('hidden');
      }
    }
  }

  private anunciarResultados(quantidade: number, filtroAno: string): void {
    let mensagem = '';
    
    if (quantidade === 0) {
      if (filtroAno) {
        mensagem = `Nenhum relatório encontrado para o ano ${filtroAno}.`;
      } else {
        mensagem = 'Nenhum relatório encontrado.';
      }
    } else {
      const anoTexto = filtroAno ? ` para o ano ${filtroAno}` : '';
      mensagem = `${quantidade} relatório${quantidade !== 1 ? 's' : ''} encontrado${quantidade !== 1 ? 's' : ''}${anoTexto}. Use as setas para navegar.`;
    }
    
    this.anunciarMudanca(mensagem);
  }

  private anunciarMudanca(mensagem: string): void {
    // Criar elemento temporário para anunciar mudanças
    const anuncio = document.createElement('div');
    anuncio.setAttribute('aria-live', 'polite');
    anuncio.setAttribute('aria-atomic', 'true');
    anuncio.className = 'sr-only';
    anuncio.textContent = mensagem;
    
    document.body.appendChild(anuncio);
    setTimeout(() => {
      if (document.body.contains(anuncio)) {
        document.body.removeChild(anuncio);
      }
    }, 3000);
  }

  // Método para navegação por teclado nos cards (pode ser usado no template)
  onCardKeydown(event: KeyboardEvent, ano: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Encontrar o card correspondente e abrir o link
      const card = this.cards.find(c => c.dataset['year'] === ano);
      if (card) {
        const link = card as HTMLAnchorElement;
        if (link.href) {
          window.open(link.href, '_blank');
        }
      }
    }
  }

  ngOnDestroy(): void {
    // remover listeners se necessário (bom pra evitar memory leaks)
    const selectOrdem = this.selectOrdemRef?.nativeElement;
    const inputAno = this.inputAnoRef?.nativeElement;
    const btnBuscar = this.btnBuscarRef?.nativeElement;
    const btnLimpar = this.btnLimparRef?.nativeElement;

    if (selectOrdem) selectOrdem.replaceWith(selectOrdem.cloneNode(true));
    if (inputAno) inputAno.replaceWith(inputAno.cloneNode(true));
    if (btnBuscar) btnBuscar.replaceWith(btnBuscar.cloneNode(true));
    if (btnLimpar) btnLimpar.replaceWith(btnLimpar.cloneNode(true));
  }
}