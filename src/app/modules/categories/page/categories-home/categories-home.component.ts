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

import { CategoriesService } from '@app/services/categories/categories.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { IDeleteCategoryAction } from '@app/models/interfaces/categories/event/i-DeleteCategoryAction';
import { IEditCategoryAction } from '@app/models/interfaces/categories/event/i-EditCategoryAction';
import { IEventAction } from '@app/models/interfaces/products/event/i-EventAction';
import { IGetCategoriesResponse } from '@app/models/interfaces/categories/response/i-GetCategoriesResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: [],
})
export class CategoriesHomeComponent
  implements OnInit, OnDestroy
{
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesDatas: IGetCategoriesResponse[] = [];

  private ref!: DynamicDialogRef;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
  ) {}
  ngOnInit(): void {
    this.getAllCategories();
  }
  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar categorias',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleCategorytAction(event: IEventAction): void {
    if (event) {
      this.ref = this.dialogService.open(
        CategoryFormComponent,
        {
          header: event.action,
          width: '70%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          data: {
            event: event,
          },
        },
      );
      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAllCategories(),
        });
    }
  }

  handleDeleteCategoryAction(
    event: IDeleteCategoryAction,
  ): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão da categoria: ${event.categoryName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () =>
          this.deleteCategory(event.category_id),
      });
    }
  }

  deleteCategory(category_id: string): void {
    if (category_id) {
      this.categoriesService
        .deleteCategory({ category_id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getAllCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria removido com sucesso!',
              life: 3000,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover a categoria',
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
