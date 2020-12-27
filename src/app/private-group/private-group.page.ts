import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {CreateGroupModalPage} from '../groups/create-group-modal/create-group-modal.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirestoreService ,Room} from '../services/firestore.service';
import {CurrentRoomService} from '../current-room.service';
import { Router  } from "@angular/router";

@Component({
  selector: 'app-private-group',
  templateUrl: './private-group.page.html',
  styleUrls: ['./private-group.page.scss'],
})
export class PrivateGroupPage implements OnInit {
  rooms: Observable<any[]>;
  no_group=true;
  currentUser:any;

  constructor(
    private modalCtrl: ModalController,
    private chatService: FirestoreService,
    private router:Router,
    private afAuth: AngularFireAuth ,
    private curRoomService:CurrentRoomService
  ) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
      console.log(this.currentUser.uid)
      this.rooms=this.chatService.getPrivateRoom(this.currentUser.uid);
      if(this.rooms){
        this.no_group=false;
        console.log('aa');
       
      }
    })

   
  }
  async handleCreateBtn(){
    const modal= await this.modalCtrl.create({
      component:CreateGroupModalPage,
      componentProps: {
        privateRoom:true
      },
    })
    await modal.present();
    const {data}=await modal.onDidDismiss();
    if(data){
      // this.rooms=this.chatService.getRoom();
      if(data.register){
        
      }
    }
  }
  goToMessage(room_id,name,room){
    console.log('room',room)
    this.curRoomService.setRoom(room);
    this.router.navigate(['room-message',{room_id:room_id,room_name:name}])
  }
  isProfileDefault(profile){
    if(profile=="default"){
      return true
    }
    else{
      return false
    }
  }

}
