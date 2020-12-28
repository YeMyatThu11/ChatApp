import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService,Message} from '../services/firestore.service';
import { ModalController } from '@ionic/angular';
import {GroupSettingPage} from '../group-setting/group-setting.page';
import {SettingMenuModalPage} from '../setting-menu-modal/setting-menu-modal.page';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
@Component({
  selector: 'app-room-message',
  templateUrl: './room-message.page.html',
  styleUrls: ['./room-message.page.scss'],
})
export class RoomMessagePage implements OnInit {
  room_id:string;
  room_name:string;
  created_by;
  newMsg = '';
  oneToOneChat="false";
  logoImage: any;
  messages:Observable<any>
  constructor(
    private aRoute: ActivatedRoute,
    private router:Router,
    private chatService: FirestoreService,
    private actionSheet: ActionSheetController,
    private plt: Platform,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath
  ) {
    this.aRoute.params.subscribe(data=>{
     this.room_id=data.room_id;
     this.room_name=data.room_name;
      this.oneToOneChat=data.oneToOneChat;
    })
  }

  ngOnInit() {
    this.getMessages();
    console.log(this.oneToOneChat)
  }
  sendMessage() {
    console.log('room',this.room_id);
    console.log('user',this.chatService.currentUser.uid);
    
    this.chatService.addRoomMessage(this.room_id,this.newMsg,this.chatService.currentUser.uid).then(() => {
      this.newMsg = '';
    });
  }
  getMessages(){
    this.messages=this.chatService.getRoomMessage(this.room_id);
  }
  async goToSetting(){
    const modal= await this.modalCtrl.create({
      component:SettingMenuModalPage,
      componentProps: {
        room_id:this.room_id,
        room_name:this.room_name,
      },
    })
    await modal.present();
    const {data}=await modal.onDidDismiss();
  }
  checkOneToOne(){
    if(this.oneToOneChat=="false"){
      return true;
    }
    else{
      return false;
    }
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
   
      this.chatService.addRoomMessage(this.room_id,this.logoImage,this.chatService.currentUser.uid).then(() => {
        this.logoImage = '';
      
      // this.content.scrollToBottom();
    });
    console.log(this.logoImage)
}, (err) => {
  console.log('error',err)
});
}
}
