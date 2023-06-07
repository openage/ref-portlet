import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.css']
})
export class JsonEditorComponent implements OnInit, OnChanges {

  @Input()
  value: any;

  @Input()
  placeholder: string;

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  text: string;

  constructor() { }

  ngOnInit() {
    if (typeof this.value === 'string') {
      this.text = this.syntaxHighlight(this.value);
    } else {
      const value = JSON.stringify(this.value || {}, undefined, 2);
      this.text = this.syntaxHighlight(value);
    }
  }

  ngOnChanges(): void {
    if (typeof this.value === 'string') {
      this.text = this.syntaxHighlight(this.value);
    } else {
      const value = JSON.stringify(this.value || {}, undefined, 2);
      this.text = this.syntaxHighlight(value);
    }
  }

  onSelect() {

  }
  onTextChange($event) {
    let subject: string = $event.target.tagName === 'INPUT' ? $event.target.value : $event.target.innerText;

    if (!subject) {
      return;
    }

    subject = subject.replace(/(?:\r\n|\r|\n)/g, '');

    const value = JSON.parse(subject);
    this.change.emit(value);
  }

  syntaxHighlight(json) {
    json = json
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // .replace(/(?:\r\n|\r|\n)/g, '<br>');

    // eslint-disable-next-line max-len
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

}
