import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { IUser, Pic } from 'src/app/lib/oa/core/models';
import { Profile } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'oa-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input()
  view: 'text' | 'avatar' | 'pic' | 'selectable' = 'avatar';

  @Input()
  value: string | IUser | Profile | Pic | any;

  @Input()
  default: string;

  @Input()
  pic: Pic;

  @Input()
  text: string;

  @Input()
  user: IUser;

  @Input()
  url: string;

  @Input()
  profile: Profile;

  @Input()
  type: 'micro' | 'button' | 'thumbnail' | 'box' | 'microPic' = 'button';

  @Input()
  shape: 'square' | 'round' = 'round';

  @Input()
  size: number;

  @Input()
  border = 'var(--default)';

  @Input()
  color = 'var(--default)';

  @Output()
  click: EventEmitter<any> = new EventEmitter();

  @Input()
  style: any;

  @Input()
  selected = false;

  constructor() { }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {

    if (this.value) {
      if (typeof this.value === 'string') {
        if (this.value.startsWith('http') || this.value.startsWith('/')) {
          this.url = this.value;
        } else {
          this.text = this.value;
        }
      } else if (this.value instanceof Profile || this.value.pic || this.value.firstName) {
        this.profile = this.value;
      } else if (this.value instanceof IUser || this.value.profile) {
        this.user = this.value;
      } if (this.value instanceof Pic || this.value.url || this.value.thumbnail) {
        this.pic = this.value;
      }
    } else if (this.default) {
      if (this.default.startsWith('http') || this.default.startsWith('/')) {
        this.url = this.default;
      } else {
        this.text = this.default;
      }
    } else {
      this.text = '+';
    }

    if (!this.profile && this.user && this.user.profile) {
      this.profile = this.user.profile;
    }

    if (this.profile && this.profile.pic && this.profile.pic.url) {
      this.pic = this.profile.pic;
    }

    if (this.pic) {
      this.view = 'pic';
    } else {
      if (this.profile) {
        if (this.profile.firstName) {
          this.text = this.profile.firstName;
          if (this.profile.lastName && this.text.indexOf(this.profile.lastName) === -1) {
            this.text = `${this.text} ${this.profile.lastName}`;
          }
        }
      }
      if (!this.text && this.user) {
        this.text = this.user.code || this.user.email || this.user.phone;
      }
    }

    this.style = {
    };

    if (this.border && this.border !== 'none') {
      this.style['border'] = `1px solid ${this.border}`;
    }

    if (this.color) {
      this.style['color'] = this.color;
      this.style['backgroundColor'] = '#ffffff';
    }

    let size = 40;

    if (this.type) {
      switch (this.type) {
        case 'micro':
          size = 15;
          break;

        case 'button':
          size = 25;
          break;

        case 'thumbnail':
          size = 40;
          break;

        case 'microPic':
          size = 70;
          break;

        case 'box':
          size = 100;
          break;
      }
    }

    this.size = this.size || size;

    switch (this.view) {
      case 'pic':
        this.style['background-image'] = `url("${this.pic.url}")`;
        this.style['background-repeat'] = 'no-repeat';

        this.style['background-size'] = 'cover';
        this.style['height'] = `${this.size}px`;
        this.style['width'] = `${this.size}px`;
        break;
    }

    switch (this.shape) {
      case 'round':
        this.style['borderRadius'] = `50%`;
        break;
    }

    // switch (this.size) {
    //   default:
    //     this.picSize = 40;
    //     break;
    // }
  }

  onClick() {
    this.selected = true;
    this.click.emit();
  }

  getInitials(text) {
    let item = '';
    (text || '').split(' ').forEach(i => item = `${item} ${i}`)
    return item.trim();
  }

}
