import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from 'src/app/login/login.component';
import { LoginService } from 'src/app/services/login.service';
import { mockLoginService, mockToken } from 'src/app/utils/mocks/test.mocks';

import { MenuComponent } from './menu.component';

describe('Given the MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let service: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(LoginService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When onInit', () => {
    describe('And there is a token', () => {
      it('Then it should call getLoggedUser$ service', () => {
        spyOn(localStorage, 'getItem').and.returnValue(mockToken);
        const spyLogin = spyOn(service.userLogged$, 'next').and.callThrough();

        component.ngOnInit();

        expect(spyLogin).toHaveBeenCalled();
      });
    });

    describe('And call getLoggedUsers$ with no token', () => {
      it('Then it should return', () => {
        service.token$.next('Test');
        spyOn(localStorage, 'getItem').and.returnValue(null);

        const spyLogin = spyOn(service.userLogged$, 'next').and.callThrough();
        component.ngOnInit();

        expect(spyLogin).not.toHaveBeenCalled();
      });
    });
  });

  describe('When called the handleLogout method', () => {
    it('Then it should call loggedUser service', () => {
      const spyLogout = spyOn(service.userLogged$, 'next').and.callThrough();
      component.handleLogout();

      expect(spyLogout).toHaveBeenCalled();
    });
  });

  describe('When called the sendToParent Method', () => {
    it('Then it should send the value with next', () => {
      const spyNext = spyOn(component.burger, 'next');
      component.sendToParent();
      expect(spyNext).toHaveBeenCalled();
    });
  });
});
