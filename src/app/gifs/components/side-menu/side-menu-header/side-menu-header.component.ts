import {  Component } from '@angular/core';
import { environment } from '@enviornments/environment.development';

@Component({
  selector: 'gifs-app-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
})
export class SideMenuHeaderComponent { 
  envs = environment;
};
