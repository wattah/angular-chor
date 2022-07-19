import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationUsageComponent } from './modification-usage.component';

describe('ModificationUsageComponent', () => {
  let component: ModificationUsageComponent;
  let fixture: ComponentFixture<ModificationUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
