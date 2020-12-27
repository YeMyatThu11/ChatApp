import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentRoomService {
  currentRoom:any;
  constructor() { }
  setRoom(room){
    this.currentRoom=room;
  }
  getRoom(){
    return this.currentRoom;
  }
}
