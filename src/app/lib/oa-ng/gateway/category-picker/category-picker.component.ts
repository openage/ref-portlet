import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Category } from 'src/app/lib/oa/gateway/models';
import { CategoryService } from 'src/app/lib/oa/gateway/services/category.service';

@Component({
  selector: 'gateway-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.css']
})
export class CategoryPickerComponent implements OnInit {

  @ViewChild('categoryIcon')
  inputContainer: ElementRef;

  @Input()
  readonly = false;

  @Input()
  value: Category = new Category();

  @Input()
  searchField = 'name';

  @Input()
  label: string;

  @Input()
  params: any = {};

  @Input()
  view: 'picker' | 'readonly' | 'default' = 'default'

  @Output()
  changed: EventEmitter<Category> = new EventEmitter();

  isSelected = false;
  position = 'left-down';

  constructor(
    public categoryService: CategoryService
  ) { }

  ngOnInit() {
    if (!this.value) { this.value = new Category({ icon: 'oa-category-add', name: 'Add Category' }); }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }

  onTogglePopup(show?: boolean) {

    if (show !== undefined) {
      this.isSelected = show;
    } else {
      this.isSelected = !this.isSelected;
    }

    setTimeout(() => {
      if (this.isSelected) {
        const bounds = this.inputContainer.nativeElement.getBoundingClientRect();

        // this.ddlWidth = bounds.width;

        const vertical = bounds.top / window.innerHeight > .5 ? 'up' : 'down';
        const horizontal = bounds.left / window.innerWidth > .5 ? 'left' : 'right';

        this.position = `${horizontal}-${vertical}`;
      }
    });
  }
}
