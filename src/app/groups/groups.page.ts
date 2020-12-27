import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {CreateGroupModalPage} from './create-group-modal/create-group-modal.page';
import { Observable } from 'rxjs';
import { FirestoreService ,Room} from '../services/firestore.service';
import { Router  } from "@angular/router";
@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})

export class GroupsPage implements OnInit {
  rooms: Observable<any[]>;
  no_group=true;
  constructor(
    private modalCtrl: ModalController,
    private chatService: FirestoreService,
    private router:Router
  ) { }

  ngOnInit() {
    this.rooms=this.chatService.getRoom();
    if(this.rooms){
      this.no_group=false;
    }
  }
  async handleCreateBtn(){
    const modal= await this.modalCtrl.create({
      component:CreateGroupModalPage,
    })
    await modal.present();
    const {data}=await modal.onDidDismiss();
    if(data){
      this.rooms=this.chatService.getRoom();
      if(data.register){
        
      }
    }
  }
  goToMessage(room_id,name){
    this.router.navigate(['room-message',{room_id:room_id,room_name:name}])
  }
}
