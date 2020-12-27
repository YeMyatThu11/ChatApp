import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomMessagePage } from './room-message.page';

describe('RoomMessagePage', () => {
  let component: RoomMessagePage;
  let fixture: ComponentFixture<RoomMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
