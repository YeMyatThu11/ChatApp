import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupSettingPage } from './group-setting.page';

describe('GroupSettingPage', () => {
  let component: GroupSettingPage;
  let fixture: ComponentFixture<GroupSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
