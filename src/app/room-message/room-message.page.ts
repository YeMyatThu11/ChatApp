import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService,Message} from '../services/firestore.service';
import { ModalController } from '@ionic/angular';
import {GroupSettingPage} from '../group-setting/group-setting.page';
import {SettingMenuModalPage} from '../setting-menu-modal/setting-menu-modal.page';
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
  messages:Observable<any>
  constructor(
    private aRoute: ActivatedRoute,
    private router:Router,
    private chatService: FirestoreService,
    private modalCtrl: ModalController,
  ) {
    this.aRoute.params.subscribe(data=>{
     this.room_id=data.room_id;
     this.room_name=data.room_name;
    
    })
  }

  ngOnInit() {
    this.getMessages();
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

}
