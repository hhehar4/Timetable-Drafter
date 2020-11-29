import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalListsComponent } from './personal-lists.component';

describe('PersonalListsComponent', () => {
  let component: PersonalListsComponent;
  let fixture: ComponentFixture<PersonalListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
