import { Directive,Output,EventEmitter,ElementRef,HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollable]'
})
export class ScrollableDirective {
  @Output() scrollEvent =new EventEmitter();
  constructor(
    private el:ElementRef,
    ) {}
   @HostListener('scroll',['$event'])
   onScroll(event){
     try{
      const height=this.el.nativeElement.scrollHeight;
      const offset=this.el.nativeElement.offsetHeight;
      const top=event.target.scrollTop();
      if(top>height-offset-1){
        this.scrollEvent.emit('bottom')
      }
      if(top==0){
       this.scrollEvent.emit('top');
      }
 
     }
     catch(err){
      console.log('error');
     }
    
   }

}
