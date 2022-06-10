import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/interfaces/country';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    country: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router, private http: HttpClient) { }

  countries: Country[] = [];

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirect()
    }

    this.loadCountries();
  };

  onSubmit() {
    const email: string = this.signupForm.value.email,
      password: string = this.signupForm.value.password,
      firstName: string = this.signupForm.value.firstName,
      lastName: string = this.signupForm.value.lastName,
      countryId: string = this.signupForm.value.country;

    this.authService.signup(firstName, lastName, email, password, countryId).then((success) => {
      this.redirect();
    }).catch((err) => { console.log(err) })
  }

  private loadCountries() {
    const APICountryURL = 'https://api.synature.ch:443/api/public/countries';
    this.http.get<Country[]>(APICountryURL).subscribe((res: Country[]) => {
      this.countries = res;
      this.getCurrentLocation();
    });
  }

  private getCurrentLocation() {
    const APIURL = 'https://ipapi.co/country';
    this.http.get(APIURL, {responseType: "text"}).subscribe({
      next: (data: any) => {
        const currentCountry = this.countries.find(country => country.code === data);
        if (currentCountry != null) {
          this.signupForm.controls['country'].setValue(currentCountry?.id);
        } else {
          this.signupForm.controls['country'].setValue(this.countries.find(country => country.code === 'CH')?.id);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private redirect() {
  this.router.navigate(['/']);
}

getFlagEmoji(countryCode: string) {
  return countryCode.toUpperCase().replace(/./g, char =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
}

}
