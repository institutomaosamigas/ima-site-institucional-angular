import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  images = [
    '../../../assets/galeria/acao1.jpg',
    '../../../assets/galeria/acao2.jpg',
    '../../../assets/galeria/acao3.jpg',
    '../../../assets/galeria/acao4.jpg',
    '../../../assets/galeria/acao5.jpg'
  ];

  currentIndex = 0;
  autoplay = true;
  interval: any;

  constructor(private zone: NgZone, private el: ElementRef) {}
  
  ngAfterViewInit() {
    this.startAutoplay();

    const questions = this.el.nativeElement.querySelectorAll('.faq-question') as NodeListOf<HTMLElement>;

    questions.forEach((item: HTMLElement) => {
      item.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  scrollToQuemSomos(): void {
    const section = document.getElementById('quem-somos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  startAutoplay() {
    // executa o autoplay fora da zona do Angular para evitar loops infinitos
    this.zone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        if (this.autoplay) {
          // volta pro Angular só pra atualizar o binding
          this.zone.run(() => this.next());
        }
      }, 4000);
    });
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  toggleAutoplay() {
    this.autoplay = !this.autoplay;
  }
}
