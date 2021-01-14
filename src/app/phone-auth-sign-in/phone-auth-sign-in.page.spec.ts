import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhoneAuthSignInPage } from './phone-auth-sign-in.page';

describe('PhoneAuthSignInPage', () => {
  let component: PhoneAuthSignInPage;
  let fixture: ComponentFixture<PhoneAuthSignInPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneAuthSignInPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneAuthSignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
