import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SejaVoluntarioComponent } from './seja-voluntario.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SejaVoluntarioComponent', () => {
  let component: SejaVoluntarioComponent;
  let fixture: ComponentFixture<SejaVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SejaVoluntarioComponent],
      providers: [provideAnimations()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SejaVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
