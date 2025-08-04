import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../gifs/mapper/gir.mapper';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';

const GIF_KEY = 'gifs'; //? Clave para almacenar los gifs en el localStorage


//*TODO: Cargar el historial de busqueda de gifs desde el localStorage
const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}'
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs
}

@Injectable({ providedIn: 'root' })
export class GifService {
  //? Se realiza la peticion a la API de Giphy para obtener los gifs
  //* Se utiliza el metodo get del HttpClient para realizar la peticion
  private http = inject(HttpClient);
  //* Se utiliza el metodo map del RxJS para transformar los datos obtenidos

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  })

  trendingGifs = signal<Gif[]>([]);


  trendingGifsLoading = signal(true);



  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage()); //? Historial de busqueda de gifs

  searchHistoryKeys = computed(
    () => Object.keys(this.searchHistory())
  ); //? Indica si el historial de busqueda esta cargando

  constructor() {
    this.loadTrendingGifs();
    this.searchHistory.set(loadFromLocalStorage());
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

  //? Efecto secundario para guardar el historial de busqueda en el localStorage

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs', historyString);
  });  
}
