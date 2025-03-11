import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParserService, EvalService, CompilerService, DiscoveryService } from '@zvenigora/ng-eval-core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  expression: string | undefined;
  result: any;
  // create services using dependency injection
  constructor(
    private parserService: ParserService,
    private evalService: EvalService,
    private compilerService: CompilerService,
  ) { }

  // create services using new operator
  // private parserService: ParserService;
  // private evalService: EvalService;
  // private compilerService: CompilerService;

  // constructor() { 
  //   this.parserService = new ParserService();
  //   this.evalService = new EvalService(this.parserService);
  //   this.compilerService = new CompilerService(this.parserService, this.evalService); 
  // }

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
    // evaluation
    const expression = '2 + 3 * a';
    const context = { a: 10 };
    this.result = this.evalService.simpleEval(expression, context); // 32
    console.log(expression + ' = ', this.result);
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
