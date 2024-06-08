import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductEvent } from '@app/models/enums/products/ProductsEvent';
import { ProductFormComponent } from '@app/modules/products/components/product-form/product-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
})
export class ToolbarNavigationComponent {
  constructor(
    private cookie: CookieService,
    private router: Router,
    private dialogService: DialogService,
  ) {}

  handleLogout(): void {
    this.cookie.delete('USER_INFO');
    this.router.navigate(['/home']);
  }

  handleSaleProduct(): void {
    const saleProductAction =
      ProductEvent.SALE_PRODUCT_EVENT;
    this.dialogService.open(ProductFormComponent, {
      header: saleProductAction,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: saleProductAction },
      },
    });
  }
}
