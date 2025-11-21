import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { SejaVoluntarioComponent } from './pages/seja-voluntario/seja-voluntario.component';
import { DoacoesComponent } from './pages/doacoes/doacoes.component';
import { TransparenciaComponent } from './pages/transparencia/transparencia.component';
import { GeradorCurriculoComponent } from './pages/gerador-curriculo/gerador-curriculo.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seja-voluntario', component: SejaVoluntarioComponent },
  { path: 'doacoes', component: DoacoesComponent },
  { path: 'transparencia', component: TransparenciaComponent },
  { path: '**', redirectTo: '' }
];
