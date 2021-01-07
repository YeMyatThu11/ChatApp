import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire//database';

@Component({
  selector: 'app-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements OnInit {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  @Input('isInModal') isInModal = false; //To determine whether this componet is created using a modal or not
  @Output('onGifSelect') selectionEvent = new EventEmitter(); //TO emmit event when an gif is selected
  imageUrl: any[] = [];
  constructor(
    private afsg: AngularFireStorage,
    private afdb: AngularFireDatabase,
    private modalCtrl: ModalController
  ) {
    console.log('Stamp')
    this.getImageDatabase();
  }

  ngOnInit() { }
  getImageDatabase() {
    this.afdb.list('/stamp').snapshotChanges(['child_added']).subscribe(images => {
      images.forEach(image => {
        this.getImageStorage(image);
      })
      console.log(images);
    })
  }
  getImageStorage(image: any) {
    const imgRef = image.payload.exportVal().ref;
    this.afsg.ref(imgRef).getDownloadURL().subscribe(imgUrl => {
      this.imageUrl.push({
        url: imgUrl
      })
    })
  }
  selectStamp(url) {
    let selectionData = {
      data: url
    };
    this.selectionEvent.emit(selectionData);
    if (this.isInModal) {
      this.modalCtrl.dismiss(selectionData); //Dismiss the modal with data
    }
  }

}