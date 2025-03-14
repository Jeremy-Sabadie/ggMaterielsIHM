import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielDialogComponent } from './materiel-dialog.component';

describe('MaterielDialogComponent', () => {
  let component: MaterielDialogComponent;
  let fixture: ComponentFixture<MaterielDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterielDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterielDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
