import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeradorCurriculoComponent } from './gerador-curriculo.component';

describe('GeradorCurriculoComponent', () => {
  let component: GeradorCurriculoComponent;
  let fixture: ComponentFixture<GeradorCurriculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeradorCurriculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeradorCurriculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
