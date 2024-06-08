import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CategoriesService } from '@app/services/categories/categories.service';
import { ICreateProductRequest } from '@app/models/interfaces/products/request/i-CreateProductRequest';
import { IEditProductRequest } from '@app/models/interfaces/products/request/i-EditProductRequest';
import { IEventAction } from '@app/models/interfaces/products/event/i-EventAction';
import { IGetAllProductsResponse } from './../../../../models/interfaces/products/response/i-GetAllProductsResponse';
import { IGetCategoriesResponse } from '@app/models/interfaces/categories/response/i-GetCategoriesResponse';
import { ISaleProductRequest } from '@app/models/interfaces/products/request/i-SaleProductRequest';
import { MessageService } from 'primeng/api';
import { ProductEvent } from '@app/models/enums/products/ProductsEvent';
import { ProductsDataTransferService } from '@app/shared/services/products/products-data-transfer.service';
import { ProductsService } from '@app/services/products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent
  implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesDatas: IGetCategoriesResponse[] = [];

  public selectedCategory: Array<{ name: string; code: string }> = [];

  public productAction!: {
    event: IEventAction;
    productData: Array<IGetAllProductsResponse>;
  };

  public productSelectedDatas!: IGetAllProductsResponse;



  public productsDatas: IGetAllProductsResponse[] = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required]
  });

  public saleProductSelected!: IGetAllProductsResponse;

  public renderDropdown: boolean = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private productsService: ProductsService,
    public ref: DynamicDialogConfig,
    private producstDtService: ProductsDataTransferService,
  ) { }
  ngOnInit(): void {
    this.productAction = this.ref.data;


    this.productAction?.event?.action === this.saleProductAction && this.getProductDatas()

    this.getAllCategories();

    this.renderDropdown = true;
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;

            if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productData) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string);
            }

          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (
      this.addProductForm.value &&
      this.addProductForm.valid
    ) {
      const requestCreateProduto: ICreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value
          .description as string,
        category_id: this.addProductForm.value
          .category_id as string,
        amount: Number(this.addProductForm.value.amount),
      };
      this.productsService
        .createProduct(requestCreateProduto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Produto ${response.name} criado com sucesso!`,
                life: 5000,
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar Produdo!`,
              life: 5000,
            });
            console.log(err);
          },
        });
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: IEditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: Number(this.editProductForm.value.amount),
        category_id: this.editProductForm.value.category_id as string,
      }
      this.productsService.editProduct(requestEditProduct).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Produto editado com sucesso!`,
            life: 5000,
          });
          //this.editProductForm.reset();
        },
        error: (err) => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar Produdo!`,
            life: 5000,
          });
          //this.editProductForm.reset();
        }
      });
    }
  }

  handleSubmitSaleProduct(): void {
    if (
      this.saleProductForm.value &&
      this.saleProductForm.valid
    ) {

      const requestSaleData: ISaleProductRequest = {
        amount: this.saleProductForm.value.amount as number,
        product_id: this.saleProductForm.value.product_id as string
      }

      this.productsService.saleProduct(requestSaleData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Venda do produto ${response.name} efetuada com sucesso!`,
                life: 5000,
              });
              this.saleProductForm.reset();
              this.getProductDatas();
              this.router.navigate(['/dashboard'])
            }
          }, error: (err) => {
            console.log(err);
            this.saleProductForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao vender Produdo!`,
              life: 5000,
            });
          }
        })

    }
  }

  getProductSelectedDatas(productId: string): void {
    const allProduct = this.productAction.productData;
    if (allProduct.length > 0) {
      const productFiltered = allProduct.filter(
        (element) => element.id === productId,
      );
      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];
        this.editProductForm.setValue({
          name: this.productSelectedDatas.name,
          price: this.productSelectedDatas.price,
          amount: this.productSelectedDatas.amount,
          description: this.productSelectedDatas.description,
          category_id: this.productSelectedDatas.category.id,
        });
      }
    }
  }

  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.producstDtService.setProductsData(
                this.productsDatas
              );
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
