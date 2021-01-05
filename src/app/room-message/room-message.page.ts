import { Component, OnInit } from '@angular/core';
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
  messages: Observable<any>;
  uploadTask;
  fileName;
  isFileopen=false;
  isFileChoosen=false;
  file:File;
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
    console.log('room', this.room_id);
    console.log('user', this.chatService.currentUser.uid);

    this.chatService.addRoomMessage(this.room_id, this.newMsg, this.chatService.currentUser.uid).then(() => {
      this.newMsg = '';
    });
  }
  getMessages() {
    this.messages = this.chatService.getRoomMessage(this.room_id);
  }
  isSimpleMessage(message){
    if(!message.msg.includes('data:image/jpeg;base64') && !message.msg.includes('https://firebasestorage.googleapis.com')){
      return true;
    }
    else{
      return false;
    }
  }
  getFileMetaData(metadata){
    // let meta : any = metadata
    if(metadata != undefined){
          console.log('metadata is',metadata.size);
      return metadata.size;
    } else return null
   

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
  // async sendFile() {
  //   this.fileChooser.open().then((uri)=>{
  //     console.log('file url',uri);
  //     // this.filePath.resolveNativePath(uri).then(async (path)=>{
  //     //   console.log('path');
  //     //   let filepath=path;
  //     //   let fileFrag=filepath.split('/');
  //     //   let fileName=fileFrag.pop();
  //     //   filepath=fileFrag.join('/');
  //     //   filepath=filepath+"/";
  //     //   console.log('file path final',filepath);
  //     //   console.log('fileName',fileName);
  //     //   const buffer=await this.file.readAsArrayBuffer(filepath,fileName).then(buffer=>{
  //     //     console.log(buffer)});
  //     //   console.log(buffer)

  //     // })
  //     this.file.resolveLocalFilesystemUrl(uri).then(async (newurl)=>{
  //       console.log('new url',newurl);
  //       console.log('type of file',typeof(newurl));
  //       console.log('type of file name',newurl.name)
  //       let dirPath=newurl.nativeURL.substr(0, newurl.nativeURL.lastIndexOf('/') + 1);
        
  //       console.log(dirPath);
  //       let type = this.getMimeType(newurl.name.split('.').pop());
  //       const buffer = await this.file.readAsArrayBuffer(dirPath,newurl.name);
  //       console.log(buffer)
  //       const fileBlob = new Blob([buffer], type);
  //       const randomId = Math.random()
  //       .toString(36)
  //       .substring(2, 8);
  //       const uploadTask = firebase.storage().ref(`files/${new Date().getTime()}_${randomId}`).put(
  //         fileBlob
  //       );
  //     }) 
  //   })
  // }
  getMimeType(fileExt) {
    if (fileExt == 'wav') return { type: 'audio/wav' };
    else if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'mp4') return { type: 'video/mp4' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime'};
  }
  detectFiles(e){
    this.isFileChoosen=!this.isFileChoosen;
    this.selectedFiles=e.target.files;
    this.file = this.selectedFiles.item(0);
     let fileFrag=this.file.name.split(" ");
     this.fileName=fileFrag[0]+" "+fileFrag[1]+" ...";
     console.log(this.fileName)
  }
  uploadSingle() {
    this.uploadTask = this.upload(this.file)
  }
  upload(file: File) {
    const storageRef = firebase.storage().ref().child(`file/${this.file.name}`);
    const uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,(snapshot)=>{

    },
    (err)=>{

    },
    ()=>{
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
          console.log('done')
        });
      });
    });
  }
  downloadFile(url){
    if(url){
      console.log(url);
      let request:DownloadRequest={
        uri:url,
        title:'MyFile',
        description: '',
        mimeType: '',
        visibleInDownloadsUi: true,
        destinationInExternalFilesDir: {
            dirType: 'Downloads',
            subPath: 'MyFile.apk'
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
    
}
