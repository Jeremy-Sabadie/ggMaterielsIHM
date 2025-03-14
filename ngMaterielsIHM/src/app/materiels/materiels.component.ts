import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgFor, NgIf } from '@angular/common';
import { MaterielDialogComponent } from '../materiel-dialog/materiel-dialog.component';

@Component({
  selector: 'app-materiels',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './materiels.component.html',
  styleUrls: ['./materiels.component.css'],
})
export class MaterielsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'serviceDat',
    'endGarantee',
    'proprietaireId',
    'actions',
  ];
  materiels = new MatTableDataSource([
    {
      id: 1,
      name: 'Ordinateur Dell',
      serviceDat: '2024-01-01',
      endGarantee: '2026-01-01',
      proprietaireId: 3,
    },
    {
      id: 2,
      name: 'Imprimante HP',
      serviceDat: '2023-07-15',
      endGarantee: '2025-07-15',
      proprietaireId: 2,
    },
  ]);

  constructor(private dialog: MatDialog) {}

  addMaterial() {
    const dialogRef = this.dialog.open(MaterielDialogComponent, {
      width: '400px',
      data: {
        id: null,
        name: '',
        serviceDat: '',
        endGarantee: '',
        proprietaireId: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id = this.materiels.data.length + 1;
        this.materiels.data = [...this.materiels.data, result];
      }
    });
  }

  editMaterial(material: any) {
    const dialogRef = this.dialog.open(MaterielDialogComponent, {
      width: '400px',
      data: material,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.materiels.data.findIndex((m) => m.id === result.id);
        this.materiels.data[index] = result;
        this.materiels.data = [...this.materiels.data]; // Mise à jour de la source de données
      }
    });
  }

  deleteMaterial(id: number) {
    this.materiels.data = this.materiels.data.filter((m) => m.id !== id);
  }
}
