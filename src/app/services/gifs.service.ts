import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { environment } from '@environments/environment';
@Injectable({ providedIn: 'root' })
export class GifService {

  private http = inject(HttpClient)

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/treding` , {
      params: {
        api_key: environment.gifphyApiKey,
        limit: '20',
      }
    }).subscribe((resp) => {
      console.log(resp)
    })
  }
}
