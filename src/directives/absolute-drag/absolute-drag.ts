import { Directive, Input, ElementRef, Renderer } from '@angular/core';
import { DomController } from 'ionic-angular';

@Directive({
  selector: '[absolute-drag]'
})
export class AbsoluteDrag {

  @Input('startLeft') startLeft: any;
  @Input('startTop') startTop: any;

  constructor(public element: ElementRef, public renderer: Renderer, public domCtrl: DomController) {

  }

  ngAfterViewInit() {
    console.log('[start X: ' + this.startLeft + ' | ' + 'start Y: ' + this.startTop + ']');
    this.renderer.setElementStyle(this.element.nativeElement, 'position', 'absolute');
    this.renderer.setElementStyle(this.element.nativeElement, 'left', this.startLeft + 'px');
    this.renderer.setElementStyle(this.element.nativeElement, 'top', this.startTop + 'px');

    let hammer = new window['Hammer'](this.element.nativeElement);
    hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_ALL });

    hammer.on('pan', (ev) => {
      this.handlePan(ev);
    });

  }

  handlePan(ev){
    console.log(ev);
    let newLeft = ev.center.x - (ev.target.clientWidth / 2);
    let newTop = ev.center.y - (ev.target.clientHeight / 2) - ev.target.offsetParent.offsetTop;

    this.domCtrl.write(() => {
      console.log('[x: ' + newLeft + ' | ' + 'y: ' + newTop + ']');
      this.renderer.setElementStyle(this.element.nativeElement, 'left', newLeft + 'px');
      this.renderer.setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
    });

  }

}
