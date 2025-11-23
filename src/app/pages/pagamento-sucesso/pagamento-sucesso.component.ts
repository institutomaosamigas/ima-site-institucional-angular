import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagamento-sucesso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagamento-sucesso.component.html',
  styleUrl: './pagamento-sucesso.component.scss'
})
export class PagamentoSucessoComponent {
  orderId: string | null;
  constructor(private route: ActivatedRoute) {
    this.orderId = this.route.snapshot.queryParamMap.get('token');
  }
}