import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingMenuModalPage } from './setting-menu-modal.page';

describe('SettingMenuModalPage', () => {
  let component: SettingMenuModalPage;
  let fixture: ComponentFixture<SettingMenuModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingMenuModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingMenuModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
