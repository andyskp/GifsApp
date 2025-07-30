import {  Component } from '@angular/core';
import { GiftListComponent } from "../../components/gift-list/gift-list.component";

@Component({
  selector: 'app-search-page',
  imports: [GiftListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent { 
  onSearch(query: string){
    console.log('Search query:', query);
  }
}
