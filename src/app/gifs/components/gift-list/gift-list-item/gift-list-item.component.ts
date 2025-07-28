import { Component, input } from '@angular/core';
import { GiftListComponent } from '../gift-list.component';

@Component({
  selector: 'app-gift-list-item',
  templateUrl: './gift-list-item.component.html',
})
export class GiftListItemComponent { 
  imageUrlUrl = input.required<string[]>();
}
