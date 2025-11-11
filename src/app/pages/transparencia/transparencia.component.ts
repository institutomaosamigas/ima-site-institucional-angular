import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-transparencia',
  standalone: true,
  imports: [],
  templateUrl: './transparencia.component.html',
  styleUrl: './transparencia.component.scss'
})
export class TransparenciaComponent {

  @ViewChild('grid', { static: false }) gridRef!: ElementRef<HTMLDivElement>;
  @ViewChild('filtroOrdem', { static: false }) selectOrdemRef!: ElementRef<HTMLSelectElement>;
  @ViewChild('filtroAno', { static: false }) inputAnoRef!: ElementRef<HTMLInputElement>;
  @ViewChild('btnBuscar', { static: false }) btnBuscarRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnLimpar', { static: false }) btnLimparRef!: ElementRef<HTMLButtonElement>;

  private cards: HTMLElement[] = [];
  private boundSort!: (order: string) => void;
  private boundFilter!: (year: string) => void;

  ngAfterViewInit(): void {
    // proteção caso o template ainda não tenha sido renderizado no cliente
    if (!this.gridRef) return;

    const grid = this.gridRef.nativeElement;
    this.cards = Array.from(grid.querySelectorAll<HTMLElement>('.relatorio-card'));

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
    };

    this.boundFilter = (year: string) => {
      const target = parseInt(year, 10);
      this.cards.forEach(c => {
        const y = parseInt(c.dataset['year'] ?? '0', 10);
        c.style.display = !year || Number.isNaN(target) ? 'block' : (y === target ? 'block' : 'none');
      });
    };

    // ligar eventos com proteção (existência das refs)
    if (selectOrdem) {
      selectOrdem.addEventListener('change', () => this.boundSort(selectOrdem.value));
    }
    if (inputAno) {
      inputAno.addEventListener('input', () => this.boundFilter(inputAno.value));
    }
    if (btnBuscar) {
      btnBuscar.addEventListener('click', () => this.boundFilter(inputAno?.value ?? ''));
    }
    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
        if (inputAno) inputAno.value = '';
        this.boundFilter('');
      });
    }

    // inicializa com mais novo → mais antigo
    this.boundSort('desc');
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
