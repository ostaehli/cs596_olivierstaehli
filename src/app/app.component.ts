import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManualreportingComponent } from './components/manualreporting/manualreporting.component';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'synature';

  constructor(private authService: AuthenticationService, private dialogRef: MatDialog) {

  }
  openDialog() {
    this.dialogRef.open(ManualreportingComponent)
  }
  ngOnInit(): void {
    this.authService.setRefreshTimeoutFromCookieIfLoggedIn();
  }


}
