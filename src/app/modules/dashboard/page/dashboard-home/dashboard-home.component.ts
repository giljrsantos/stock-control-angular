import { ChartData, ChartOptions } from 'chart.js';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { IGetAllProductsResponse } from '@app/models/interfaces/products/response/i-GetAllProductsResponse';
import { MessageService } from 'primeng/api';
import { ProductsDataTransferService } from '@app/shared/services/products/products-data-transfer.service';
import { ProductsService } from '@app/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  public ProductList: Array<IGetAllProductsResponse> = [];

  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService,
  ) {}
  ngOnInit(): void {
    this.getProductsDatas();
  }
  getProductsDatas() {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.ProductList = response;

            this.productsDataTransferService.setProductsData(
              this.ProductList,
            );
            this.setProductsChartConfig();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
          console.log(err);
        },
      });
  }

  setProductsChartConfig(): void {
    if (this.ProductList.length > 0) {
      const documentStyle = getComputedStyle(
        document.documentElement,
      );
      const textColor =
        documentStyle.getPropertyValue('--text-color');
      const textColorSecondary =
        documentStyle.getPropertyValue(
          '--text-color-secondary',
        );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--surface-border',
      );

      this.productsChartDatas = {
        labels: this.ProductList.map(
          (element) => element.name,
        ),
        datasets: [
          {
            label: 'Quantide',
            backgroundColor:
              documentStyle.getPropertyValue(
                '--indigo-400',
              ),
            borderColor:
              documentStyle.getPropertyValue(
                '--indigo-400',
              ),
            hoverBackgroundColor:
              documentStyle.getPropertyValue(
                '--indigo-500',
              ),
            data: this.ProductList.map(
              (element) => element.amount,
            ),
          },
        ],
      };

      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
