import { Component, Input } from '@angular/core';
import { DocInfo } from '../doc-info';

@Component({
  selector: 'app-doc-info',
  templateUrl: './doc-info.component.html'
})
export class DocInfoComponent {
  @Input() DocInfo: DocInfo | undefined;
}
