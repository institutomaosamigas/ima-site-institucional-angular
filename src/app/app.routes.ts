import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { SejaVoluntarioComponent } from './pages/seja-voluntario/seja-voluntario.component';
import { DoacoesComponent } from './pages/doacoes/doacoes.component';
import { TransparenciaComponent } from './pages/transparencia/transparencia.component';
import { GeradorCurriculoComponent } from './pages/gerador-curriculo/gerador-curriculo.component';
import { PagamentoSucessoComponent } from './pages/pagamento-sucesso/pagamento-sucesso.component';
import { PagamentoCanceladoComponent } from './pages/pagamento-cancelado/pagamento-cancelado.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seja-voluntario', component: SejaVoluntarioComponent },
  { path: 'doacoes', component: DoacoesComponent },
  { path: 'transparencia', component: TransparenciaComponent },
  { path: 'pagamento-sucesso', component: PagamentoSucessoComponent },
  { path: 'sucesso', component: PagamentoSucessoComponent },
  { path: 'pagamento-cancelado', component: PagamentoCanceladoComponent },
  { path: 'cancelado', component: PagamentoCanceladoComponent },
  { path: '**', redirectTo: '' }
];
