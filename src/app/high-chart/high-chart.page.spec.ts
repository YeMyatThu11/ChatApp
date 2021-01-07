import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HighChartPage } from './high-chart.page';

describe('HighChartPage', () => {
  let component: HighChartPage;
  let fixture: ComponentFixture<HighChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighChartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HighChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
