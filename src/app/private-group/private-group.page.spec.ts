import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrivateGroupPage } from './private-group.page';

describe('PrivateGroupPage', () => {
  let component: PrivateGroupPage;
  let fixture: ComponentFixture<PrivateGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
