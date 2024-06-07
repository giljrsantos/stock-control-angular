import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CategoriesService } from '@app/services/categories/categories.service';
import { CategoryEvent } from '@app/models/enums/categories/CategoriesEvent';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ICreateCategoryRequest } from '@app/models/interfaces/categories/request/i-CreateCategoryRequest';
import { IEditCategoryAction } from '@app/models/interfaces/categories/event/i-EditCategoryAction';
import { IEditCategoryRequest } from '@app/models/interfaces/categories/request/i-EditCategoryRequest';
import { IGetCategoriesResponse } from '@app/models/interfaces/categories/response/i-GetCategoriesResponse';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoriaAction!: {
    event: IEditCategoryAction;
  };

  public categorySelectedDatas!: IGetCategoriesResponse;
  public categoriesDatas: IGetCategoriesResponse[] = [];

  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  });


  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private router: Router,
  ) { }
  ngOnInit(): void {

    this.categoriaAction = this.ref.data;
    if (this.categoriaAction.event.action === this.editCategoryAction && this.categoriaAction.event.categoryName !== null || undefined) {
      this.setCategoryName(this.categoriaAction.event.categoryName as string);
    }

  }

  handleSubmitCategoryAction(): void {

    this.categoriaAction.event.action === this.addCategoryAction ? this.handleSubmitAddCategory() : this.handleSubmitEditCategory();

    return;
  }

  handleSubmitAddCategory(): void {
    if (this.categoryForm.valid && this.categoryForm.value) {
      const requestCreateCategory: ICreateCategoryRequest = {
        name: this.categoryForm.value.name as string
      };
      this.categoriesService.createCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Categoria ${response.name} criado com sucesso!`,
                life: 5000,
              });
            }
          },
          error: (err) => {
            this.categoryForm.reset();
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar Categoria!`,
              life: 5000,
            });
          }
        })
    }

  }


  handleSubmitEditCategory(): void {
    if (this.categoryForm.valid && this.categoryForm.value && this.categoriaAction.event.id) {

      const requestEditCategory: IEditCategoryRequest = {
        name: this.categoryForm.value.name as string,
        category_id: this.categoriaAction.event.id as string,
      }

      this.categoriesService.editCategoryName(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Categoria editado com sucesso!`,
              life: 5000,
            });
          },
          error: (err) => {
            console.log(err);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao editar Categoria!`,
              life: 5000,
            });
          }
        })
    }

  }

  setCategoryName(categoryName: string): void {
    if (categoryName) {
      this.categoryForm.setValue({
        name: categoryName,
      });
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
