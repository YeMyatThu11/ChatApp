import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
@Component({
  selector: 'app-create-group-modal',
  templateUrl: './create-group-modal.page.html',
  styleUrls: ['./create-group-modal.page.scss'],
})
export class CreateGroupModalPage implements OnInit {
  name: string;
  description: string;
  isDisabled = true;
  search_user:any;
  user_name: any[]=[];
  user_id_list: any[]=[];
  privateRoom=false;
  
  profile="default";
  constructor(
    private chatService: FirestoreService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.privateRoom=this.navParams.data["privateRoom"];
    console.log(this.privateRoom)
  }
  ngDoCheck() {
    if (this.name && this.description) {
      this.isDisabled = false;
    }
    
  }
  handleClick() {
    if(this.privateRoom){
        const Ownerid=this.chatService.currentUser.uid;
        this.chatService.addPrivateRoom(this.name,this.description,'private',Ownerid,this.user_id_list,this.profile,this.user_name)
          this.modalCtrl.dismiss({
            'dismissed': true,
            'register': true
          });
    }
    else{
        const userId = this.chatService.currentUser.uid;
        this.chatService.addRoom(this.name, this.description, 'public', userId).then(() => {
          console.log('group added');
          this.modalCtrl.dismiss({
            'dismissed': true,
            'register': true
          });
        }
      )
    }
  }
  handleUserSearch(e){
    if (e.target.value.includes("@gmail.com")) {
      this.chatService.getUserWithMail(e.target.value).subscribe(data => {
        [this.search_user] =data;
        this.user_name.push(this.search_user.name);
        this.user_id_list.push(this.search_user.uid)
        console.log(this.search_user)
        console.log(this.user_id_list);
      })
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  handleBack(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
