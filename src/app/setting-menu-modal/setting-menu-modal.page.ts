import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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
  user:Observable<any>;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private chatService: FirestoreService,
    private curRoomService:CurrentRoomService
  ) { 
    
  }
  ngOnInit() {
    this.currentRoom=this.curRoomService.getRoom();
    console.log('current room',this.currentRoom);
    this.room_id=this.navParams.data["room_id"];
    this.room_name=this.navParams.data["room_name"];
    this.user=this.chatService.getUserById(this.currentRoom.createdBy);
    console.log(this.user);
    
    
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
  }
  cancel(){
    this.modalCtrl.dismiss();
  }

}
