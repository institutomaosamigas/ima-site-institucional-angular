import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pagamento-cancelado',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './pagamento-cancelado.component.html',
  styleUrl: './pagamento-cancelado.component.scss',
})
export class PagamentoCanceladoComponent implements OnInit {
  orderId: string | null = null;
  statusMsg: string = '';
  erroMsg: string = '';
  tipo: 'avulsa' | 'recorrente' | null = null;
  plano: string | null = null;
  valor: number | null = null;
  subscriptionId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('token');
    this.subscriptionId =
      this.route.snapshot.queryParamMap.get('subscription_id');

    const baseApi =
      (window as any).IMA_BFF_URL ||
      'https://3imdkv3u35sj4p2sevuwfjbru40afuzv.lambda-url.us-east-1.on.aws';

    // Se tem subscription_id, é cancelamento de assinatura recorrente
    if (this.subscriptionId) {
      this.cancelarAssinatura(baseApi);
    }
    // Se tem orderId sem subscription_id, é cancelamento de doação avulsa
    else if (this.orderId) {
      this.cancelarDoacaoAvulsa(baseApi);
    } else {
      this.erroMsg = 'Nenhum identificador de pagamento encontrado.';
    }
  }

  private cancelarAssinatura(baseApi: string) {
    this.http
      .get(`${baseApi}/doacoes/cancelar-assinatura/${this.subscriptionId}`)
      .subscribe({
        next: (res: any) => {
          this.statusMsg =
            'Assinatura recorrente cancelada, nenhum valor foi cobrado.';
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
          } else {
            this.buscarDetalhesPorAssinatura(baseApi);
          }
        },
        error: (err) => {
          this.erroMsg =
            'Não foi possível atualizar o cancelamento da assinatura automaticamente.';
          console.error('Erro ao cancelar assinatura:', err);
          this.buscarDetalhesPorAssinatura(baseApi);
        },
      });
  }

  private cancelarDoacaoAvulsa(baseApi: string) {
    this.http
      .post(`${baseApi}/doacoes/cancelar`, { orderId: this.orderId })
      .subscribe({
        next: () => {
          this.statusMsg = 'Doação cancelada, nenhum valor foi cobrado.';
          this.buscarDetalhesPorOrdem(baseApi);
        },
        error: (err) => {
          this.erroMsg =
            'Não foi possível atualizar o cancelamento automaticamente.';
          console.error('Erro ao cancelar doação:', err);
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
