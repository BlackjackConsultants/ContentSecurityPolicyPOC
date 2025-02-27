import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ParserService } from '@zvenigora/ng-eval-core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private service!: ParserService;

  title = 'CspUnsafeVal';
  safeEvalValue: string = '1 + foo';
  useWindowEval: any;

  safeEval() {
    this.service = new ParserService();
    this.service.parse(this.safeEvalValue);
    if (this.useWindowEval)
      window.eval(this.safeEvalValue);
  }
}
