
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { Router  } from "@angular/router";
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})

export class MessagesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  search_user:any;
  messages: Observable<any[]>;
  newMsg = '';
  keyword;
  users:Observable<any[]>;
  currentUser;
  currentuserId;
  logoImage: any;
  privateRoomId;
    constructor(
        private chatService: FirestoreService,
        private router:Router
     ) { }
 
    ngOnInit() {
      this.users=this.chatService.getUsers();
      this.chatService.getUserById(this.chatService.currentUser.uid).
      subscribe(data=>{
        this.currentUser=data;
        console.log(this.currentUser);
      });
      setTimeout(()=>{
        if(this.currentUser){
          console.log('user id for presence',this.currentUser.uid);
          this.chatService.detectUserPresence(this.currentUser.uid);
        }
        else{
          console.log('aa')
        }
      },3000)
    }
    onSearch(e){
      if (e.target.value.includes("@gmail.com")) {
        this.chatService.getUserWithMail(e.target.value).subscribe(data => {
            [this.search_user]=data;
            this.keyword="";
        })
      }
    }
    goToMessage(user){
      if(user.uid>this.chatService.currentUser.uid){
        this.privateRoomId=this.chatService.currentUser.uid+user.uid;
        console.log('privarte room id',this.privateRoomId);
      }
      else{
        this.privateRoomId=user.uid+this.chatService.currentUser.uid;
        console.log('privarte room id',this.privateRoomId);
      }
      this.currentuserId=this.chatService.currentUser.uid;
      let userIdList=[this.currentuserId,user.uid];
      let memberNameList=[this.currentUser.name,user.name];
      
      console.log(this.chatService.currentUser);
      console.log(memberNameList);
      console.log(this.currentuserId)
      this.chatService.addPrivateRoomWithId('Private User Chat','desc','onetoone',this.currentuserId,userIdList,"default",memberNameList,this.privateRoomId);
      this.router.navigate(['room-message',{room_id:this.privateRoomId,room_name:user.name,oneToOneChat:true}])
    }
}