import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SejaVoluntarioComponent } from './seja-voluntario.component';

describe('SejaVoluntarioComponent', () => {
  let component: SejaVoluntarioComponent;
  let fixture: ComponentFixture<SejaVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SejaVoluntarioComponent]
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
