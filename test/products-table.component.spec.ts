import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ProductsTableComponent } from '../src/app/modules/products/components/products-table/products-table.component';

describe('ProductsTableComponent', () => {
  let component: ProductsTableComponent;
  let fixture: ComponentFixture<ProductsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ProductsTableComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
