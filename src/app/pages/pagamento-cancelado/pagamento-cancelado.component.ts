import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pagamento-cancelado',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './pagamento-cancelado.component.html',
  styleUrl: './pagamento-cancelado.component.scss'
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
    const baseApi = (window as any).IMA_BFF_URL || 'http://localhost:3336';
    if (this.orderId) {
      this.http
        .post(`${baseApi}/doacoes/cancelar`, { orderId: this.orderId })
        .subscribe({
          next: () => {
            this.statusMsg = 'Doação cancelada, nenhum valor foi cobrado.';
            this.buscarDetalhes(baseApi);
          },
          error: () => {
            this.erroMsg = 'Não foi possível atualizar o cancelamento automaticamente.';
            this.buscarDetalhes(baseApi);
          },
        });
    }
  }

  private buscarDetalhes(baseApi: string) {
    if (!this.orderId) return;
    this.http.get(`${baseApi}/doacoes/por-ordem/${this.orderId}`).subscribe({
      next: (res: any) => {
        const d = res?.dados;
        if (d) {
          this.tipo = d.tipo ?? null;
          this.plano = d.plano ?? null;
          this.valor = typeof d.valor === 'number' ? d.valor : (d.valor ? Number(d.valor) : null);
          this.subscriptionId = d.subscription_id ?? null;
        }
      },
      error: () => {}
    });
  }
}
