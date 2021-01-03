import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTaskCreateComponent } from './my-task-create.component';

describe('MyTaskCreateComponent', () => {
  let component: MyTaskCreateComponent;
  let fixture: ComponentFixture<MyTaskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTaskCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
