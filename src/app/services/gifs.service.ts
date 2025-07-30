import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { environment } from '@environments/environment';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../gifs/mapper/gir.mapper';
@Injectable({ providedIn: 'root' })
export class GifService {
  //? Se realiza la peticion a la API de Giphy para obtener los gifs
  //* Se utiliza el metodo get del HttpClient para realizar la peticion
  private http = inject(HttpClient);
  //* Se utiliza el metodo map del RxJS para transformar los datos obtenidos
  trendingGifs =  signal<Gif[]>([]);
  trendingGifsLoading = signal(true);
  constructor() {
    this.loadTrendingGifs();
    console.log("Servicio creado");
    
  }

  loadTrendingGifs() {

    //* Se realiza la peticion a la API de Giphy para obtener los gifs
    //* Se utiliza el metodo get del HttpClient para realizar la peticion
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.gifphyApiKey,
          limit: 20,
        },
      }).subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log(gifs);
      });
  }
}
