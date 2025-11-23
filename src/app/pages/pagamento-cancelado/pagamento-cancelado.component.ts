import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagamento-cancelado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagamento-cancelado.component.html',
  styleUrl: './pagamento-cancelado.component.scss'
})
export class PagamentoCanceladoComponent {
  orderId: string | null;
  constructor(private route: ActivatedRoute) {
    this.orderId = this.route.snapshot.queryParamMap.get('token');
  }
}