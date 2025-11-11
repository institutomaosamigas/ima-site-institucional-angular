import { Component, ElementRef, NgZone } from '@angular/core';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './core/home/home.component';
import { RouterOutlet } from '@angular/router';
import { SejaVoluntarioComponent } from './pages/seja-voluntario/seja-voluntario.component';
import { DoacoesComponent } from './pages/doacoes/doacoes.component';
import { TransparenciaComponent } from './pages/transparencia/transparencia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, HomeComponent, SejaVoluntarioComponent, DoacoesComponent, TransparenciaComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'site-institucional-ima-angular';

}
