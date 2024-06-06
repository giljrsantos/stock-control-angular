import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ProductsHomeComponent } from '../src/app/modules/products/page/products-home/products-home.component';

describe('ProductsHomeComponent', () => {
  let component: ProductsHomeComponent;
  let fixture: ComponentFixture<ProductsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ProductsHomeComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update productsDatas when API successfully fetches products', () => {
    const mockProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];
    const productsServiceMock = {
      getAllProducts: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest
          .fn()
          .mockImplementation((callbacks) => {
            callbacks.next(mockProducts);
          }),
      }),
    };
    const messageServiceMock = { add: jest.fn() };
    const routerMock = { navigate: jest.fn() };
    // const component = new ProductsHomeComponent(
    //   productsServiceMock,
    //   {} as any,
    //   routerMock,
    //   messageServiceMock
    // );
    component.getAPIProductsDatas();
    expect(component.productsDatas).toEqual(mockProducts);
    expect(
      productsServiceMock.getAllProducts,
    ).toHaveBeenCalled();
  });
});
