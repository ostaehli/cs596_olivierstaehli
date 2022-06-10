import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
import { MapMarkerService } from './services/marker-services/map-marker.service';
import { AuthInterceptorService } from './services/interceptors/auth-interceptor.service';

// Components
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { MatSliderModule } from '@angular/material/slider';


import {MatMenuModule} from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { ManualreportingComponent } from './components/manualreporting/manualreporting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DetectionlistComponent } from './components/detectionlist/detectionlist.component';
import { AdddeviceComponent } from './components/adddevice/adddevice.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    SignupComponent,
    ManualreportingComponent,
    DetectionlistComponent,
    AdddeviceComponent
  ],
  imports: [
    BrowserModule,
    MatSliderModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatChipsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    MapMarkerService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: "BACKEND_URL", useValue: "https://api.synature.ch/api"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
