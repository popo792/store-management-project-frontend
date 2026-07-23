import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CashiersComponent } from './cashiers';

describe('Cashiers', () => {
  let component: CashiersComponent;
  let fixture: ComponentFixture<CashiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashiersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CashiersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});