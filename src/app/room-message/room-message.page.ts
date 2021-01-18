import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService, Message } from '../services/firestore.service';
import { ModalController } from '@ionic/angular';
import { GroupSettingPage } from '../group-setting/group-setting.page';
import { SettingMenuModalPage } from '../setting-menu-modal/setting-menu-modal.page';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
// import { File, FileEntry } from '@ionic-native/File/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import firebase from 'firebase';
import * as moment from 'moment';
import { snapshotChanges } from '@angular/fire/database';
import { Downloader, DownloadRequest } from '@ionic-native/downloader/ngx';
import {IonContent} from '@ionic/angular';
@Component({
  selector: 'app-room-message',
  templateUrl: './room-message.page.html',
  styleUrls: ['./room-message.page.scss'],
})
export class RoomMessagePage implements OnInit {
  room_id: string;
  room_name: string;
  created_by;
  newMsg = '';
  oneToOneChat = "false";
  logoImage: any;
  selectedFiles: FileList;
  messages:any[]=[];
  uploadTask;
  fileName;
  isFileopen=false;
  isFileChoosen=false;
  file:File;
  progressbar:number;
  isFileSend=false;
  
  progressSize;
  progressMetadata:any;
  showEmojiPicker = false;
  @ViewChild('scrollElement') content:IonContent;
  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private chatService: FirestoreService,
    private actionSheet: ActionSheetController,
    private plt: Platform,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private camera: Camera,
    // private file: File,
    private filePath: FilePath,
    private fileChooser:FileChooser,
    private downloader:Downloader

  ) {
    this.aRoute.params.subscribe(data => {
      this.room_id = data.room_id;
      this.room_name = data.room_name;
      this.oneToOneChat = data.oneToOneChat;
    })
  }

  ngOnInit() {
    this.getMessages();
    console.log(this.oneToOneChat)
  }
  sendMessage() {
   
    if(!this.isFileSend){
      this.chatService.addRoomMessage(this.room_id, this.newMsg, this.chatService.currentUser.uid).then(() => {
       
        setTimeout(()=>{ this.updateScroll()},200)//wait 200ms for getRoomMesssage() and scroll to bottom
        this.chatService.updateRecentMessage(this.room_id,this.newMsg);
        this.newMsg = '';
      });
    }
    else{
      this.isFileSend=false;
      this.isFileopen=false;
      this.uploadTask = this.upload(this.file);
    }
  }
  getMessages() {
   
   this.chatService.getRoomMessage(this.room_id).subscribe(data=>{
    console.log('data',data)
    this.messages=[];
    data.map((m,index)=>{
      return this.messages.push(m)
    })
   });
   console.log('messages',this.messages)
   setTimeout(()=>{
     this.updateScroll(400)
   },500)
   
  }
  updateScroll(time=0){
    console.log('scrollToBottom');
    this.content.scrollToBottom(time);
  }
  isSimpleMessage(message){
    if(!message.msg.includes('data:image/jpeg;base64') && !message.msg.includes('https://firebasestorage.googleapis.com')){
      return true;
    }
    else{
      return false;
    }
  }
  isMessageImage(message){
    if(message){
      if(message.msg.includes('data:image/jpeg;base64') || (message.msg.includes('.png')&& !message.metadata.hasOwnProperty('size'))){
        return true
      }
      else{
        return false
      }
    }
  }
  isMessageFile(message){
    if(message.msg.includes('https://firebasestorage.googleapis.com') && message.metadata.hasOwnProperty('size')){
      return true
    }
    else{
      return false
    }
  }
  getFileMetaData(metadata){
    // let meta : any = metadata
    if(metadata != undefined){
      console.log('metadata is',metadata.size);
      return metadata.size;
    } 
    else return null
   

  }
  async goToSetting() {
    const modal = await this.modalCtrl.create({
      component: SettingMenuModalPage,
      componentProps: {
        room_id: this.room_id,
        room_name: this.room_name,
      },
    })
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
  checkOneToOne() {
    if (this.oneToOneChat == "false") {
      return true;
    }
    else {
      return false;
    }
  }
  async sendImage() {
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

      // this.chatService.addRoomMessage(this.room_id,this.logoImage,this.chatService.currentUser.uid).then(() => {

      console.log(this.logoImage)
      const storageRef = firebase.storage().ref().child('/images');
      const uploadTask = storageRef.putString(this.logoImage);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        console.log(snapshot);
      }, (error) => {

      },
        () => {
          this.saveDownloadUrl(storageRef.getDownloadURL)
        })

      // });
      console.log(this.logoImage)
    }, (err) => {
      console.log('error', err)
    });
  }
  saveDownloadUrl(url) {
    console.log(url)
    // this.chatService.addRoomMessage(this.room_id,url,this.chatService.currentUser.uid)
  }
  calCurrentTime(createdAt) {
    if(createdAt){
      let m = moment(createdAt.toDate())
      let mFormatted = m.fromNow()
      return mFormatted;
    }
   
  }

  getMimeType(fileExt) {
    if (fileExt == 'wav') return { type: 'audio/wav' };
    else if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'mp4') return { type: 'video/mp4' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime'};
  }
  detectFiles(e){
    this.isFileSend=true;
    this.isFileChoosen=true;
    this.selectedFiles=e.target.files;
    this.file = this.selectedFiles.item(0);
    
     this.fileName=this.file.name.slice(0,15)+'...';  
     console.log(this.fileName)
  }
 
  upload(file: File) {
    console.log(this.progressbar)
    const storageRef = firebase.storage().ref().child(`file/${this.file.name}`);
    const uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,(snapshot)=>{
      console.log('snapshot',snapshot.metadata);
      this.progressbar=snapshot.bytesTransferred/snapshot.totalBytes *100;
      if(this.progressbar==100){
        this.progressbar-=1;
      }
      console.log(this.progressbar)
    },
    (err)=>{

    },
    ()=>{
      
      this.progressbar=null;
      let metadata;
      storageRef.getMetadata().then(function(m){
        console.log(m.size);
        console.log(m.name);
        console.log(m.contentType);
        metadata={
          size:m.size,
          name:m.name,
          type:m.contentType
        }
      })

      storageRef.getDownloadURL().then(url=>{
        console.log(url);
        console.log(metadata)
        this.chatService.addRoomMessageWithFileMetadata(this.room_id,url, this.chatService.currentUser.uid,metadata).then(() => {
          setTimeout(()=>{ this.updateScroll()},200)//wait 200ms for getRoomMesssage() and scroll to bottom
        });
        // this.chatService.addRoomMessage(this.room_id, this.newMsg, this.chatService.currentUser.uid).then(() => {
        
        //   setTimeout(()=>{ this.updateScroll()},200)//wait 200ms for getRoomMesssage() and scroll to bottom
        //  this.chatService.updateRecentMessage(this.room_id,this.newMsg);
        //  this.newMsg = '';
        // });
      });
    });
  }
  downloadFile(url,metadata){
    if(url){
      console.log(url,metadata);
      let request:DownloadRequest={
        uri:url,
        title:metadata.name,
        description: '',
        mimeType: metadata.type,
        visibleInDownloadsUi: true,
        destinationInExternalFilesDir: {
            dirType: 'Download',
            subPath: ''
        }
      }
      this.downloader.download(request).then(location=>{
        console.log('file downloaded at ',location);
      }).catch(error=>{
        console.log('error',error)
      })
    }
  }
  changeToMB(byte){
    return Math.round(byte/1024/1024 *100)/100
  }
  openFile(){
    this.isFileopen=!this.isFileopen;
  }
  checkMsgEmpty(){
    if(this.newMsg === ''){
      if(!this.isFileChoosen){
        return true
      }
    }
    else{
      return false
    }
  }
  fileCancel(){
    this.isFileSend=false;
    this.isFileChoosen=false;
    this.file=null;
  }
  addSticker(event){
    console.log('Sticker Url'+event.data)
    this.chatService.addRoomMessage(this.room_id,event.data, this.chatService.currentUser.uid);
  }
  loadData(e){
    this.chatService.first=false;
   this.chatService.getRoomMessage(this.room_id).subscribe(data=>{
     
     data.map((message,i)=>{
       console.log(i);
       this.messages.push(message)
      return this.messages.splice(i,0,message);
     });
     console.log(this.messages)
     console.log(this.messages.length);
     this.chatService.first=true;
     e.target.complete();
   })
  }
}
