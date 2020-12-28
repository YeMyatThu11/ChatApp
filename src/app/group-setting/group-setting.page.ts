import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../services/firestore.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { finalize } from "rxjs/operators";
import { takeWhile } from 'rxjs/operators';
@Component({
  selector: 'app-group-setting',
  templateUrl: './group-setting.page.html',
  styleUrls: ['./group-setting.page.scss'],
})
export class GroupSettingPage implements OnInit {
 
  isChecked=false;
  suggestedUser:any[]=[];
  selectedUser:any[]=[];
  search_user:any;
  user_name: any[]=[];
  user_id_list: any[]=[];
  room_id;
  currentRoom:any;
  newMember;
  email;
  subscription:Subscription;
  constructor(
    private chatService:FirestoreService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {
    this.suggestedUser=[...this.chatService.suggestedUser];
    console.log(this.suggestedUser)
   }

  ngOnInit() {
    this.room_id=this.navParams.data["room_id"];
    console.log('room id',this.room_id);
    
  }
  ionViewWillLeave(){
    this.suggestedUser.map(user=>user.checked=false);
    console.log('view leave')
  }
  updateCheck(user){
    user.checked=!user.checked;
    if(user.checked){
      this.selectedUser.push(user);
      console.log(this.selectedUser)
      console.log(this.suggestedUser)
    }
    else{
      this.selectedUser=this.selectedUser.filter(u=>u.uid!==user.uid)
      console.log(this.selectedUser)
    }
  }
  handleUserSearch(e){
    console.log('aa')
    if (e.target.value.includes("@gmail.com")) {
      this.chatService.getUserWithMail(e.target.value).subscribe(data => {
        this.email="";
        [this.search_user] =data;
        if(!this.selectedUser.some(u=>u.uid==this.search_user.uid)){
          this.selectedUser.push({name:this.search_user.name,uid:this.search_user.uid,checked:false});
        }
        console.log(this.search_user)
      })
    }
  }
  addUser(){
    const obser:Observable<any>= this.chatService.getSinglePrivateRoom(this.room_id);
    this.subscription= obser.subscribe(data=>{
      console.log('subscribe')
      this.currentRoom=data;
      console.log(this.currentRoom);
      const userIdList=this.selectedUser.map(user=>user.uid);
      const userNameList=this.selectedUser.map(user=>user.name);
      this.newMember=[...this.currentRoom.members,...userIdList];
      let newMemberNameList=[...this.currentRoom.memberNameList,...userNameList]
      var mySet=new Set(this.newMember);
      var mySet1=new Set(newMemberNameList)
      this.newMember=[...mySet];
      newMemberNameList=[...mySet1]
      console.log(this.newMember);
      this.chatService.addMemberToPrivateRoom(this.room_id,this.newMember,newMemberNameList);
      this.subscription.unsubscribe();
      this.modalCtrl.dismiss(
        {'dismissed': true}
      );
    });
    
  }
  back(){
    this.suggestedUser.map(user=>user.checked=false);
    console.log('changed',this.suggestedUser)
    this.modalCtrl.dismiss(
      {'dismissed': true}
    )
   
  }

}
