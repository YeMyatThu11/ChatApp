import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {canActivate,redirectUnauthorizedTo,redirectLoggedInTo} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin=()=>redirectUnauthorizedTo(['/']);
const redirectLoggedInToChat=()=>redirectLoggedInTo(['/messages']);
const routes: Routes = [

  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then( m => m.GroupsPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToChat)
  },
  {
    path: 'room-message',
    loadChildren: () => import('./room-message/room-message.module').then( m => m.RoomMessagePageModule)
  },
  {
    path: 'private-group',
    loadChildren: () => import('./private-group/private-group.module').then( m => m.PrivateGroupPageModule)
  },
  {
    path: 'group-setting',
    loadChildren: () => import('./group-setting/group-setting.module').then( m => m.GroupSettingPageModule)
  },
  {
    path: 'setting-menu-modal',
    loadChildren: () => import('./setting-menu-modal/setting-menu-modal.module').then( m => m.SettingMenuModalPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
