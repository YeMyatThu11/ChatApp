
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})

export class MessagesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
 
  messages: Observable<any[]>;
  newMsg = '';
  logoImage: any;

  constructor(
    private chatService: FirestoreService,
     private router: Router,
     private actionSheet: ActionSheetController,
     private toastController: ToastController,
     private plt: Platform, 
     private loadingController: LoadingController,
     private camera: Camera,
     private file: File,
     private filePath: FilePath

     ) { }
 
  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
    
  }
  sendMessage() {
    this.chatService.first=true;
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      // this.messages=this.chatService.getChatMessages();
    });
  }
 
  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }
  async sendImage(){
    const actionSheet = await this.actionSheet.create({
      header: 'Choose Camera or Gallery',
      buttons: [{
        text: 'Gallery',
        role: 'destructive',
        icon: 'image',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.CAMERA)
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
}
async takePhoto(sourceType: number) {
  
  const options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: sourceType,
  }
 
  this.camera.getPicture(options).then((imageData) => {
      this.logoImage = 'data:image/jpeg;base64,' + imageData;
      this.chatService.addChatMessage(this.logoImage).then(() => {
        
        // this.content.scrollToBottom();
      });
      console.log(this.logoImage)
  }, (err) => {
    console.log('error',err)
  });
}
loadData(e){
  console.log('aa');
  this.chatService.first=false;
  this.messages.pipe(map(m=>{
    return m.push(this.chatService.getChatMessages())
  }))  
  console.log(this.messages)
  setTimeout(()=>{
    e.target.complete();
  },800)
}
}
