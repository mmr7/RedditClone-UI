import { Component, OnInit } from '@angular/core';

import {UserService} from '../services/user-service'

@Component({
  selector: 'app-register-component',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent {

  private username: string;
  private password: string;
  private password2: string;
  private firstName: string;
  private lastName: string;

  constructor(private userService: UserService) { }


  registerClick(): void {
      this.userService.getUserCount().then(
          data => {
              if (data.length != null) {
                  this.userService.register(this.username, this.password, this.firstName, this.lastName, data.length + 1).subscribe();
              }
              else {
                  this.userService.register(this.username, this.password, this.firstName, this.lastName, 1).subscribe();
              }
          });
  }

}
