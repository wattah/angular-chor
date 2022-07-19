import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteParkItemPopUpComponent } from './delete-park-item-pop-up.component';

describe('DeleteParkItemPopUpComponent', () => {
  let component: DeleteParkItemPopUpComponent;
  let fixture: ComponentFixture<DeleteParkItemPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteParkItemPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteParkItemPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
