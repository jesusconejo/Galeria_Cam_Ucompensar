import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  imports: [IonImg, IonCol, IonRow, IonGrid, IonIcon, IonFabButton, IonFab, IonHeader, IonToolbar, 
    IonButtons, IonMenuButton, IonTitle, IonContent,
    CommonModule
  ],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor( public fotoService: FotoService) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.fotoService.loadSaved();
  }

  addPhotoToGallery(){
    this.fotoService.takePhoto();
  }
}
