import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFireDatabase,AngularFireObject,AngularFireList}  from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap, map,mergeMap ,mergeAll} from 'rxjs/operators';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { Md5 } from 'ts-md5/dist/md5';



export interface User {
  uid: string;
  email: string;
  profile: string;
  name: string;
}
const md5 = new Md5();
export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
  profile: string;
  metadata: any;
}
export interface Room {
  createdAt: firebase.firestore.FieldValue;
  description: string;
  name: string;
  ownerId: string;
  type: string;
}
@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  currentUser: any = null;
  collection: any;
  userStatusRealTimeDbRef: any;
  userStatusFireStoreRef: any;
  public firstInResponse: any;
  public lastInResponse: any;
  first = true;
  messageCollection: AngularFirestoreCollection;
  recentMessage = "";
  suggestedUser: any[] = [
    { name: "Ag Ag", uid: "h3aU3Z0Jr9hYPGNMqm4PCXFqJIt1", checked: false },
    { name: "Bo Bo", uid: "TJPL806VoZh5yWObldnm3rAr3332", checked: false },
    { name: "Kg Kg", uid: "DHy9iRxvgxS69bnhHxDTnQjMen42", checked: false },
    { name: "Myat Thu", uid: "AjYF6har6kWqtkiermPTL4yB1Ri1", checked: false },
    { name: "Bear", uid: "eH8Af4DAxIaa79dnvG6Rsc46fmi1", checked: false },
  ]

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private db:AngularFireDatabase
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    })
  }
  detectUserPresence(uid) {
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    const isOfflineForFireStore = {
      state: 'offline',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const isOnlineForFireStore = {
      state: 'online',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };
    //create a user status ref in realtime db
    this.userStatusRealTimeDbRef= firebase.database().ref('/status/' + uid);
    //create a user status collection in firestore 
    this.userStatusFireStoreRef = this.afs.doc(`users/${uid}`);

    console.log('is this running non stop')
    firebase.database().ref('.info/connected').on('value', (snapshot) => {
      if (snapshot.val() == false) {
        console.log('user active developing', this.currentUser);
        console.log('user active ');
        
        return;
      }
      this.userStatusRealTimeDbRef.onDisconnect().set(isOfflineForDatabase).then(()=>{
        firebase.database().ref('/status/' + uid).set(isOnlineForDatabase);
       
      });
    })

  }
  async signup({ email, password, name }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    const uid = credential.user.uid;

    return this.afs.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email,
      profile: `http://gravatar.com/avatar/${md5.appendStr(credential.user.email).end()}?d=identicon`,
      name: name,
      
    })
  }
  async signUpWithPhNo(uid, email, name): Promise<any> {
    return this.afs.doc(`users/${uid}`).set({
      uid,
      email: email,
      profile: `http://gravatar.com/avatar/${md5.appendStr(email).end()}?d=identicon`,
      name: name
    })
  }


  signIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  // TODO Chat functionality
  addChatMessage(msg) {
    return this.afs.collection('messages').add({
      msg: msg,
      from: this.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  addRoom(name, desc, type, ownerId) {
    return this.afs.collection('groups').add({
      name: name,
      description: desc,
      type: type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      ownerId: ownerId
    })
  }
  addPrivateRoom(name, desc, type, ownerId, userIdList, profile, memberNameList) {
    const privateRoom: any = this.afs.collection('privateRoom').doc();
    privateRoom.set({
      name: name,
      desc: desc,
      recentMessage: this.recentMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: ownerId,
      members: userIdList,
      profile: profile,
      type: type,
      memberNameList: memberNameList
    });
  }
  addPrivateRoomWithId(name, desc, type, ownerId, userIdList, profile, memberNameList, customId) {
    const privateRoom: any = this.afs.doc(`privateRoom/${customId}`);
    privateRoom.set({
      name: name,
      desc: desc,
      recentMessage: this.recentMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: ownerId,
      members: userIdList,
      profile: profile,
      type: type,
      memberNameList: memberNameList
    });
  }

  addMemberToPrivateRoom(roomId, userList, newMemberNameList) {
    const privateRoom: AngularFirestoreDocument = this.afs.doc(`privateRoom/${roomId}`);
    privateRoom.update({
      members: userList,
      memberNameList: newMemberNameList
    })
  }
  removeMemberFromPrivateRoom(roomId, userList, memberNameList) {
    const privateRoom: AngularFirestoreDocument = this.afs.doc(`privateRoom/${roomId}`);
    privateRoom.update({
      members: userList,
      memberNameList: memberNameList
    })
  }
  getSinglePrivateRoom(roomId) {
    const privateRoom: AngularFirestoreDocument = this.afs.doc(`privateRoom/${roomId}`);
    return privateRoom.valueChanges();
  }
  deleteSinglePrivateRoom(roomId) {
    const privateRoom: AngularFirestoreDocument = this.afs.doc(`privateRoom/${roomId}`);
    privateRoom.delete();
  }
  getPrivateRoom(uid) {
    const privateRoom: AngularFirestoreCollection = this.afs.collection('privateRoom', ref => ref.where('members', 'array-contains', uid).where("type", "==", "private").orderBy('createdAt').limit(10))
    return privateRoom.snapshotChanges().pipe(
      map(arr => {
        return arr.map(snap => {
          const id = snap.payload.doc.id;
          const data = snap.payload.doc.data();
          return { id, ...data }
        })
      })
    );
  }
  getRoom() {
    const rommCollection: AngularFirestoreCollection = this.afs.collection('groups', ref => ref.orderBy('createdAt').limit(10))
    return rommCollection.snapshotChanges().pipe(map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return { id, ...data };
      })
    })
    )
  }
  addRoomMessage(roomID, msg, uid) {
    return this.afs.collection(`room-messages/${roomID}/messages`).add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      from: uid,
      msg: msg,
      metadata: {}
    })
  }
  addRoomMessageWithFileMetadata(roomId, msg, uid, metadata) {
    return this.afs.collection(`room-messages/${roomId}/messages`).add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      from: uid,
      msg: msg,
      metadata: metadata
    })
  }
  updateRecentMessage(roomID, msg) {

    return this.afs.doc(`privateRoom/${roomID}`).update({
      recentMessage: msg
    })
  }
  getRoomMessage(roomID) {
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        //fetch the last 10 message, if user scroll to upper,else condition will work and fetch another 10 message
        if (this.first) {
          this.messageCollection = this.afs.collection(`room-messages/${roomID}/messages`, ref => ref.orderBy('createdAt').limitToLast(10));
        }
        else {
          this.messageCollection = this.afs.collection(`room-messages/${roomID}/messages`, ref => ref.orderBy('createdAt').endBefore(this.firstInResponse).limitToLast(10));
        }
        // get the first message from 10 message that is fetched earlier
        // in order to mark as starting point for fetching again
        this.messageCollection.snapshotChanges().subscribe(res => {
          this.firstInResponse = res[0].payload.doc;
        })
        let messages: Observable<Message[]> = this.messageCollection.valueChanges() as Observable<Message[]>;
        return messages;
      }),
      map(messages => {
        // Get the real name for each user
        for (let m of messages) {
          let userArr = [];
          userArr = this.getUserForMsg(m.from, users);
          m.fromName = userArr[1];
          m.myMsg = this.currentUser.uid === m.from;
          m.profile = userArr[0];
        }
        return messages
      })
    )

  }

  getChatMessages() {
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        // this.collection=this.afs.collection('messages',ref => ref.orderBy('createdAt').limitToLast(10)).snapshotChanges().subscribe(res=>{
        //   this.firstInResponse=res[0].payload.doc;
        //   console.log(this.firstInResponse)
        //   this.lastInResponse = res[res.length - 1].payload.doc;
        // })
        if (this.first) {
          this.messageCollection = this.afs.collection('messages', ref => ref.orderBy('createdAt').limitToLast(10));
        }
        else {
          this.messageCollection = this.afs.collection('messages', ref => ref.orderBy('createdAt').endAt(this.firstInResponse).limitToLast(10));
        }

        this.messageCollection.snapshotChanges().subscribe(res => {
          this.firstInResponse = res[0].payload.doc;
          this.lastInResponse = res[res.length - 1].payload.doc;
          console.log(this.lastInResponse)
        })
        let messages: Observable<Message[]> = this.messageCollection.valueChanges({ idField: 'id' }) as Observable<Message[]>;
        console.log(messages);
        return messages;
      }),
      map(messages => {
        // Get the real name for each user
        for (let m of messages) {
          let userArr = [];
          userArr = this.getUserForMsg(m.from, users);
          m.fromName = userArr[1];
          m.myMsg = this.currentUser.uid === m.from;
          m.profile = userArr[0];
        }
        return messages
      })
    )
  }
  getUsers() {
    return this.afs.collection('users', ref => ref.orderBy('name')).valueChanges({ idField: 'uid' }).pipe(
      map(users=>{
        var test = [];
        users.map((user:any)=>{
          
            this.db.object(`status/${user.uid}`).valueChanges().subscribe((data:any)=>{
              if(data){
                 user={...user,state:data.state}
                 const index=test.findIndex(userList=>{
                   return userList.uid==user.uid});
                 if(index!==-1){
                  test[index]=user;
                 }
                 else{
                  test.push(user);
                 }
              }
              else{
                user={...user,state:'offline'}
                test.push(user);
              }
            });
          
        })
        
        return test;
      })
    );
  }
  getUserById(uid) {
    return this.afs.doc(`users/${uid}`).valueChanges();
  }
  getUserWithName(userName) {
    const usrCollection: AngularFirestoreCollection = this.afs.collection('users', ref => ref.where('name', '==', userName));
    return usrCollection.valueChanges();
  }
  getUserForMsg(msgFromId, users: User[]) {
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return [usr.profile, usr.name];
      }
    }
    return ['Mg Mg'];
  }
  getUserWithMail(mail: string) {
    return this.afs.collection('users', ref => ref.where('email', '==', mail)).valueChanges();
  }

}