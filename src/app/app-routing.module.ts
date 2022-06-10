import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', canActivate: [LoginGuard],  children: [
        { path: '', redirectTo: 'map', pathMatch: 'full' },
        { path: 'map', component: MapComponent },
        { path: '**', redirectTo: 'map' }
  ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
