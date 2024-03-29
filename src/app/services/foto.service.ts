import { Injectable } from '@angular/core';
import {Camera, CameraPhoto, CameraResultType, CameraSource, Photo} from '@capacitor/camera'
import {Filesystem, Directory} from '@capacitor/filesystem'
import {Storage} from '@capacitor/storage'

interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
@Injectable({
  providedIn: 'root'
})
export class FotoService {
  public fotos: UserPhoto[]=[];
  private PHOTO_STORAGE: string = "fotos";
  constructor() { }

  public async takePhoto(){

      const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
   /* this.fotos.unshift({
      filepath: "foto_"+Date.now(),
      webviewPath: fotoCapturada.webPath!
    })*/ 
    const saveImageFile = await this.savePicture(fotoCapturada);
    this.fotos.unshift(saveImageFile)
    Storage.set({
      key:  this.PHOTO_STORAGE,
      value: JSON.stringify(this.fotos)
    })
  }
  public async savePicture(cameraPhoto: CameraPhoto){

    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime+'.jpeg';
    const savedFile= await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })
    return{
      filepath: fileName,
      webviewPath: cameraPhoto.webPath!
    }
  }
  public async readAsBase64(CameraPhoto: CameraPhoto){
    const response = await fetch(CameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlodToBase64(blob) as string;

  }
  convertBlodToBase64 = (blob: Blob) => new Promise((resolve, reject)=>{
    const reader = new FileReader
    reader.onerror= reject
    reader.onload= ()=>{
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })
  public async loadSaved(){
    const listaFotos = await Storage.get({key: this.PHOTO_STORAGE})
    const listaFotosValue = listaFotos.value;
    if (listaFotosValue && typeof listaFotosValue === 'string') {
    this.fotos = JSON.parse(listaFotosValue) || []
    for(let foto of this.fotos){
      const readFile = await Filesystem.readFile({
        path: foto.filepath,
        directory: Directory.Data
      })
      //Solo web:
        foto.webviewPath = `data:image/jpeg;base64,${readFile.data}` 
    }
  }else{
    this.fotos = [];
  }
  }
}
