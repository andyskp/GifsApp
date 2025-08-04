import {  Component, signal } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'gifs-app-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
})
export class SideMenuHeaderComponent {
  envs = environment;
  name = signal("Andres Bustos")
};
