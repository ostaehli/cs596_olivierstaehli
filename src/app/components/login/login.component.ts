import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirect()
    }
  };

  onSubmit() {
    const email: string = this.loginForm.value.email, password: string = this.loginForm.value.password;

    this.authService.login(email, password).then( (success) => {
      this.redirect();
    } ).catch((err) => { console.log(err)})
  }

  private redirect() {
    this.router.navigate(['/']);
  }
}
