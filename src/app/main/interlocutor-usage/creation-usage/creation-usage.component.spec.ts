import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationUsageComponent } from './creation-usage.component';

describe('CreationUsageComponent', () => {
  let component: CreationUsageComponent;
  let fixture: ComponentFixture<CreationUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
