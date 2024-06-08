import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import {
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { IEventAction } from '@app/models/interfaces/products/event/i-EventAction';
import { IGetAllProductsResponse } from '@app/models/interfaces/products/response/i-GetAllProductsResponse';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductsDataTransferService } from '@app/shared/services/products/products-data-transfer.service';
import { ProductsService } from '@app/services/products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: [],
})
export class ProductsHomeComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$: Subject<void> = new Subject();

  private ref!: DynamicDialogRef;

  public productsDatas: IGetAllProductsResponse[] = [];

  constructor(
    private productsServive: ProductsService,
    private productDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
  ) {}
  ngOnInit(): void {
    this.getServiceProductsDatas();
  }
  getServiceProductsDatas() {
    const productsLoaded =
      this.productDtService.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else {
      this.getAPIProductsDatas();
    }
  }
  getAPIProductsDatas() {
    this.productsServive
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
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
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: IEventAction): void {
    if (event) {
      this.ref = this.dialogService.open(
        ProductFormComponent,
        {
          header: event.action,
          width: '70%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 1000,
          maximizable: true,
          data: {
            event: event,
            productData: this.productsDatas,
          },
        },
      );
      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsDatas(),
        });
    }
  }
  handleDeleteProductAction(event: {
    product_id: string;
    productName: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto ${event.productName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event.product_id),
      });
    }
  }
  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsServive
        .deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Produto removido com sucesso!`,
                life: 3000,
              });
            }
            this.getAPIProductsDatas();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover o produto!',
              life: 3000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
