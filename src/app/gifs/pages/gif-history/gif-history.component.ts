import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifService } from 'src/app/services/gifs.service';
import { GiftListComponent } from "../../components/gift-list/gift-list.component";

@Component({
  selector: 'app-gif-history',
  imports: [GiftListComponent],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent {
onScroll($event: Event) {
console.log($event);
;
}
  gifService = inject(GifService);
  query = toSignal(inject(ActivatedRoute).params.pipe(map(params => params['query']))
);
  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));
}



