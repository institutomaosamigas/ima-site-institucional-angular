import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pagamento-sucesso',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './pagamento-sucesso.component.html',
  styleUrl: './pagamento-sucesso.component.scss'
})
export class PagamentoSucessoComponent implements OnInit {
  orderId: string | null = null;
  payerId: string | null = null;
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
    const baseApi = (window as any).IMA_BFF_URL || 'http://localhost:3336';
    if (this.orderId) {
      this.http
        .post(`${baseApi}/doacoes/capturar`, { orderId: this.orderId })
        .subscribe({
          next: (res: any) => {
            this.statusMsg = 'Pagamento capturado com sucesso.';
            const d = res?.dados?.doacao;
            if (d) {
              this.tipo = d.tipo ?? null;
              this.plano = d.plano ?? null;
              this.valor = typeof d.valor === 'number' ? d.valor : (d.valor ? Number(d.valor) : null);
              this.subscriptionId = d.subscription_id ?? null;
            } else {
              this.buscarDetalhes(baseApi);
            }
          },
          error: (err) => {
            this.erroMsg = 'Não foi possível capturar automaticamente.';
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
