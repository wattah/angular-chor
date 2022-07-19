import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabLogisticsProcessingComponent } from './tab-logistics-processing.component';

describe('TabLogisticsProcessingComponent', () => {
  let component: TabLogisticsProcessingComponent;
  let fixture: ComponentFixture<TabLogisticsProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabLogisticsProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabLogisticsProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
