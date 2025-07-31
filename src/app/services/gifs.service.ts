import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { environment } from '@environments/environment';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../gifs/mapper/gir.mapper';
import { map, Observable, tap } from 'rxjs';




@Injectable({ providedIn: 'root' })
export class GifService {
  //? Se realiza la peticion a la API de Giphy para obtener los gifs
  //* Se utiliza el metodo get del HttpClient para realizar la peticion
  private http = inject(HttpClient);
  //* Se utiliza el metodo map del RxJS para transformar los datos obtenidos
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);



  searchHistory = signal<Record<string, Gif[]>>({}); //? Historial de busqueda de gifs

  searchHistoryKeys = computed(
    () => Object.keys(this.searchHistory())
  ); //? Indica si el historial de busqueda esta cargando

  constructor() {
    this.loadTrendingGifs();
    console.log('Servicio creado');
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
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log(gifs);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return (
      this.http
        .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
          params: {
            api_key: environment.gifphyApiKey,
            q: query,
            limit: 20,
          },
        }) //! Pipe permite realizar operaciones adicionales sobre el observable
        //? y tap para efectos secundarios
        //? map permite transformar los datos obtenidos
        .pipe(
          map(({ data }) => data),
          map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

          //*TODO: HISTORIAL CON UN EJECTO SECUNDRIO Tap()
          tap((items) => {
            this.searchHistory.update((history) => ({
              ...history,
              [query.toLocaleLowerCase()]: items,
            }));
          })
        )
    );

    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   console.log(gifs);
    //   return gifs
    // })
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  } 
}
