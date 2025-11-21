import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuAberto = false;

  constructor(private router: Router) {
    
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
  handleLogoKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.voltarHome();
    }
  }

  voltarHome() {
    this.router.navigate(['/']);
  }
}
