import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { LoggedUser } from 'src/types/login';
import { MenuItems } from 'src/types/menu.items';
import * as jose from 'jose';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AikidoUser } from 'src/types/aikido.user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  items: MenuItems[];
  itemsLogged: MenuItems[];
  itemsAdmin: MenuItems[];
  loggedUser$: Observable<LoggedUser>;
  token: string | null;

  @Output() burger: EventEmitter<boolean>;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private zone: NgZone
  ) {
    this.burger = new EventEmitter(true);
    this.token = '';
    this.loggedUser$ = this.loginService.userLogged$.asObservable();
    this.items = [
      {
        path: 'register',
        label: 'Register',
      },
      {
        path: 'login',
        label: 'Login',
      },
    ];
    this.itemsLogged = [
      {
        path: 'techs', // Esta es la etiqueta que hayamos puesto en el routing
        label: 'Técnicas', // Nombre a mostrar
      },
      {
        path: 'users',
        label: 'Usuarios',
      },
      {
        path: 'my-profile',
        label: 'Mi perfil',
      },
      {
        path: 'progress',
        label: 'Mi progreso',
      },
      {
        path: 'logout',
        label: 'Cerrar sesión',
      },
    ];
    this.itemsAdmin = [
      {
        path: 'techs', // Esta es la etiqueta que hayamos puesto en el routing
        label: 'Técnicas', // Nombre a mostrar
      },
      {
        path: 'users',
        label: 'Usuarios',
      },
      {
        path: 'my-profile',
        label: 'Mi perfil',
      },
      {
        path: 'add-tech',
        label: 'Añadir',
      },
      {
        path: 'progress',
        label: 'Mi progreso',
      },
      {
        path: 'logout',
        label: 'Cerrar sesión',
      },
    ];
  }

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (!token) return;
    this.loginService.token$.next(token);
    const userInfo = jose.decodeJwt(token) as unknown as LoggedUser;
    this.loginService.userLogged$.next(userInfo);
  }

  handleLogout(): void {
    localStorage.clear();
    this.loginService.token$.next('');

    this.loginService.userLogged$.next({ email: '', id: '', role: 'logout' });
    this.loginService.currentUser$.next({} as AikidoUser);
    this.burger.next(!this.burger);

    this.zone.run(() => {
      this.router.navigateByUrl('/login');
    });
  }

  sendToParent() {
    this.burger.next(!this.burger);
  }
}
