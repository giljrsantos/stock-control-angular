import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CategoriesDataTransferService } from '@app/shared/services/categories/categories-data-transfer.service';
import { CategoriesService } from '@app/services/categories/categories.service';
import { CategoryEvent } from '@app/models/enums/categories/CategoriesEvent';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ICreateCategoryRequest } from '@app/models/interfaces/categories/request/i-CreateCategoryRequest';
import { IEditCategoryAction } from '@app/models/interfaces/categories/event/i-EditCategoryAction';
import { IEventAction } from '@app/models/interfaces/products/event/i-EventAction';
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


  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  })

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private router: Router,
    private categoriesDtService: CategoriesDataTransferService,
  ) { }
  ngOnInit(): void {
    this.categoriaAction = this.ref.data;

    //this.categoriaAction.event.action
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
    //this.categoryForm.reset();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
