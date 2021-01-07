import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController,NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService} from '../services/firestore.service';
import {CurrentRoomService} from '../current-room.service';
import {GroupSettingPage} from '../group-setting/group-setting.page';
@Component({
  selector: 'app-setting-menu-modal',
  templateUrl: './setting-menu-modal.page.html',
  styleUrls: ['./setting-menu-modal.page.scss'],
})
export class SettingMenuModalPage implements OnInit {
  room_id;
  room_name;
  currentRoom:any;
  showRemoverBadge=false;
  user:Observable<any>;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private chatService: FirestoreService,
    private curRoomService:CurrentRoomService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { 
    
  }
  ngOnInit() {
    this.currentRoom=this.curRoomService.getRoom();
    console.log('current room',this.currentRoom);
    this.room_id=this.navParams.data["room_id"];
    this.room_name=this.navParams.data["room_name"];
    this.user=this.chatService.getUserById(this.currentRoom.createdBy);
    console.log(this.user);
    this.getSinglePrivatgeRoom();
    if(this.isOwner()){
      this.showRemoverBadge=true;
    }
  }
  async goToAddPeople(){
    const modal= await this.modalCtrl.create({
      component:GroupSettingPage,
      componentProps: {
        room_id:this.room_id,
        room_name:this.room_name,
      },
    })
    await modal.present();
    
    const {data}=await modal.onDidDismiss();
    if(data){
      this.getSinglePrivatgeRoom();
    }
  }
  cancel(){
    this.modalCtrl.dismiss();
  }
  getSinglePrivatgeRoom(){
    this.chatService.getSinglePrivateRoom(this.room_id).subscribe(data=>{
      this.currentRoom=data;
      console.log(this.currentRoom)
    });
  }
  removeUser(user){
    if(this.chatService.currentUser.uid==this.currentRoom.createdBy){
      this.currentRoom.memberNameList=this.currentRoom.memberNameList.filter(u=>u!=user);
      let removedUser:any;
      this.chatService.getUserWithName(user).subscribe(data=>{
        [removedUser]=data;
        this.currentRoom.members=this.currentRoom.members.filter(uid=>uid!==removedUser.uid);
      this.chatService.removeMemberFromPrivateRoom(this.room_id,this.currentRoom.members,this.currentRoom.memberNameList)
      });
    }
  }
  async deleteChatGroup(){
    const alert = await this.alertCtrl.create({
      header:"Delete Room",
      message:"Are You Sure You Want To Delete?",
      buttons:[
        {
          text: 'Cancel',
          handler: () => {
            this.alertCtrl.dismiss();
          }
        },
        {
          text: 'OK',
          handler: () => {
            if(this.isOwner()){
              this.chatService.deleteSinglePrivateRoom(this.room_id);
              this.navCtrl.pop();
              this.modalCtrl.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }
  isOwner(){
    if(this.chatService.currentUser.uid==this.currentRoom.createdBy){
      return true;
    }
    else{
      return false;
    }
  }
  
 
}
