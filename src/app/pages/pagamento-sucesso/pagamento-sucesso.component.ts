import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pagamento-sucesso',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './pagamento-sucesso.component.html',
  styleUrl: './pagamento-sucesso.component.scss',
})
export class PagamentoSucessoComponent implements OnInit {
  orderId: string | null = null;
  payerId: string | null = null;
  baToken: string | null = null;
  statusMsg: string = '';
  erroMsg: string = '';
  tipo: 'avulsa' | 'recorrente' | null = null;
  plano: string | null = null;
  valor: number | null = null;
  subscriptionId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('token');
    this.payerId = this.route.snapshot.queryParamMap.get('PayerID');
    this.baToken = this.route.snapshot.queryParamMap.get('ba_token');
    this.subscriptionId =
      this.route.snapshot.queryParamMap.get('subscription_id');

    const baseApi = (window as any).IMA_BFF_URL || 'http://localhost:3336';

    // Se tem subscription_id, é doação recorrente
    if (this.subscriptionId) {
      this.ativarAssinatura(baseApi);
    }
    // Se tem orderId sem subscription_id, é doação avulsa
    else if (this.orderId) {
      this.capturarPagamentoAvulso(baseApi);
    } else {
      this.erroMsg = 'Nenhum identificador de pagamento encontrado.';
    }
  }

  private ativarAssinatura(baseApi: string) {
    const params = this.baToken ? `?token=${this.baToken}` : '';
    this.http
      .get(
        `${baseApi}/doacoes/ativar-assinatura/${this.subscriptionId}${params}`
      )
      .subscribe({
        next: (res: any) => {
          this.statusMsg = 'Assinatura recorrente ativada com sucesso!';
          const d = res?.dados;
          if (d) {
            this.tipo = d.tipo ?? 'recorrente';
            this.plano = d.plano ?? null;
            this.valor =
              typeof d.valor === 'number'
                ? d.valor
                : d.valor
                ? Number(d.valor)
                : null;
            this.subscriptionId = d.subscription_id ?? this.subscriptionId;
          }
        },
        error: (err) => {
          this.erroMsg =
            'Não foi possível ativar a assinatura automaticamente.';
          console.error('Erro ao ativar assinatura:', err);
          this.buscarDetalhesPorAssinatura(baseApi);
        },
      });
  }

  private capturarPagamentoAvulso(baseApi: string) {
    this.http
      .post(`${baseApi}/doacoes/capturar`, { orderId: this.orderId })
      .subscribe({
        next: (res: any) => {
          this.statusMsg = 'Pagamento capturado com sucesso.';
          const d = res?.dados?.doacao;
          if (d) {
            this.tipo = d.tipo ?? 'avulsa';
            this.plano = d.plano ?? null;
            this.valor =
              typeof d.valor === 'number'
                ? d.valor
                : d.valor
                ? Number(d.valor)
                : null;
            this.subscriptionId = d.subscription_id ?? null;
          } else {
            this.buscarDetalhesPorOrdem(baseApi);
          }
        },
        error: (err) => {
          this.erroMsg = 'Não foi possível capturar automaticamente.';
          console.error('Erro ao capturar pagamento:', err);
          this.buscarDetalhesPorOrdem(baseApi);
        },
      });
  }

  private buscarDetalhesPorOrdem(baseApi: string) {
    if (!this.orderId) return;
    this.http.get(`${baseApi}/doacoes/por-ordem/${this.orderId}`).subscribe({
      next: (res: any) => {
        const d = res?.dados;
        if (d) {
          this.tipo = d.tipo ?? 'avulsa';
          this.plano = d.plano ?? null;
          this.valor =
            typeof d.valor === 'number'
              ? d.valor
              : d.valor
              ? Number(d.valor)
              : null;
          this.subscriptionId = d.subscription_id ?? null;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes por ordem:', err);
      },
    });
  }

  private buscarDetalhesPorAssinatura(baseApi: string) {
    if (!this.subscriptionId) return;
    this.http
      .get(`${baseApi}/doacoes/por-assinatura/${this.subscriptionId}`)
      .subscribe({
        next: (res: any) => {
          const d = res?.dados;
          if (d) {
            this.tipo = d.tipo ?? 'recorrente';
            this.plano = d.plano ?? null;
            this.valor =
              typeof d.valor === 'number'
                ? d.valor
                : d.valor
                ? Number(d.valor)
                : null;
            this.subscriptionId = d.subscription_id ?? this.subscriptionId;
          }
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes por assinatura:', err);
        },
      });
  }
}
