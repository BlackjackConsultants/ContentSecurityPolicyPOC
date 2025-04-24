import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParserService, EvalService, CompilerService, DiscoveryService } from '@zvenigora/ng-eval-core';
import { AngularExpressionParser } from './angular-expression-parser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  expression: string | undefined;
  result: any;
  imagePath = 'assets/images/lion.png';
  // create services using dependency injection
  constructor(
    private parserService: ParserService,
    private evalService: EvalService,
    private compilerService: CompilerService,
  ) { }

  clickHandler() {
    console.log('Button clicked!');
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/noimage.png';
  }

  /**
   * code from https://github.com/zvenigora/ng-eval
   */
  ngOnInit() {
    // create ast
    this.parsing();
    // convert ast to function
    this.compilation();
    // executes the function
    this.evaluation();
    // test assign
    this.assign();
    // test assign
    this.assignObjects();
    // troubleshooting
    this.troubleShooting();

    // angular expression parsing
    const aep = new AngularExpressionParser();
    aep.example3();

  }

  troubleShooting() {
    // const expression2 = `({'k-content-green': mappingStatus === 0, 'k-content-red': mappingStatus ===  1, 'k-content-gray': mappingStatus === 2, 'k-content-yellow': mappingStatus === 3})`;
    // evaluation
    const mappingStatus = 0;
    const expression = `({ x: 1, y: 2 })`;
    const expression2 = `({'k-content-green': mappingStatus === 0})`;
    this.result = eval(expression2);
    console.debug('using eval = ', this.result);
    this.result = this.evalService.simpleEval(expression2); // 32
    console.debug('using simpleEval = ', this.result);
  }

  /**
   * assign method assigns a value to a variable in the context.
   */
  assign() {
    const expression = 'x = y';
    const fn = this.compilerService.compile(expression);
    const context = { x: 0, y: 2 };
    const value = this.compilerService.simpleCall(fn, context); // 3
    console.log(`assign: expression = ${expression}, value = ${value}, context=`, context);
  }

  /**
   * assign method assigns a value to a variable in the context.
   */
  assignObjects() {
    const expression = 'x = y';
    const fn = this.compilerService.compile(expression);
    const context = { x: 0, y: { firstName: 'jorge', lastName: 'perez'} };
    const value = this.compilerService.simpleCall(fn, context); // 3
    console.log(`assignObjects: expression = ${expression}, value = ${value}, context=`, context);
  }

  /**
   * parsing creates ast from string expression. this allows it to work with an object that is tokenized.
   */
  parsing() {
    // parser
    let expression = "2 + 3 * 5";
    const ast = this.parserService.parse(expression);
    console.log('ast: ', ast);
  }

  /**
   * compilation converts ast to function. this allows it to be executed multiple times.
   */
  compilation() {
    const expression = 'x + y';
    const fn = this.compilerService.compile(expression);
    const context = { x: 1, y: 2 };
    const value = this.compilerService.simpleCall(fn, context); // 3
    console.log(`compilation: expression = ${expression}, value = ${value}, context=`, context);
  }

  /**
   * evaluation executes the function. this allows it to be executed
   * with different contexts and expressions.
   */
  evaluation() {
    // evaluation 1 ========================================================================
    let expression = '2 + 3 * a';
    const context = { a: 10 };
    this.result = this.evalService.simpleEval(expression, context); // 32
    console.debug('evaluation1: ' + expression + ' = ', this.result);
    // evaluation 2 ========================================================================
    const mappingStatus = 0;
    expression = `({ x: 1, y: 2 })`;
    const expression2 = `({'k-content-green': mappingStatus === 0})`;
    this.result = eval(expression2);
    console.debug('using eval = ', this.result);
    this.result = this.evalService.simpleEval(expression2); // 32
    console.debug('using simpleEval = ', this.result);
    // evaluation 3 ========================================================================
    const expression3 = `model.FileName ? model.FileName : ''`; // instead of this: const expression3 = `model.FileName || ''`;
    const context3 = { model: { FileName: 'test.txt' } };
    this.result = this.evalService.simpleEval(expression3, context3); // test.txt`;
    console.debug('evaluation3: ' + expression3 + ' = ', this.result);
  }

  async evaluationAsync() {
    // evaluation
    const context = {
      one: 1,
      two: 2,
      asyncFunc: async (a: number, b: number) => { return await (a+b); }
    };
    const expr = 'asyncFunc(one, two)';
    this.result = await this.evalService.simpleEvalAsync(expr, context); // 32
    console.log(this.result);
  }

  async compilationAsync() {
    const context = {
      one: 1,
      two: 2,
      promiseFunc: (a: number, b: number) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            return resolve(a + b);
          }, 1000);
        });
      }
    };
    const expr = 'promiseFunc(one, two)';
    const fn = this.compilerService.compileAsync(expr);
    const result = await this.compilerService.simpleCallAsync(fn, context); // 3
    console.log(result);
  }

  discovery() {
    // discovery logic
    console.log('Discovery method called');
  }
}
