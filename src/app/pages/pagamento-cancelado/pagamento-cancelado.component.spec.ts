import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagamentoCanceladoComponent } from './pagamento-cancelado.component';

describe('PagamentoCanceladoComponent', () => {
  let component: PagamentoCanceladoComponent;
  let fixture: ComponentFixture<PagamentoCanceladoComponent>; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoCanceladoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagamentoCanceladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});