import AngularExpressions from 'angular-expressions';

// Alternatively, if you prefer a namespace import:
// import * as AngularExpressions from 'angular-expressions';

// (Optional) Register a custom filter:
AngularExpressions.filters['uppercaseReverse'] = (input: string): string => {
    if (typeof input !== 'string') return input;
    // Uppercase + Reverse for demonstration
    return input.toUpperCase().split('').reverse().join('');
};
// Expected output: "!DLROW ,OLLEH"

export class AngularExpressionParser {
    example3() {
        // Create an expression that uses the custom filter:
        const expression3 = `model.FileName || ''`;

        // Compile the expression into a function:
        const compiledExpression = AngularExpressions.compile(expression3);

        // Build a context object:
        const context3 = { model: { FileName: 'test.txt' } };

        // Evaluate the expression with the provided context:
        const result = compiledExpression(expression3, context3);

        // Log the result
        console.debug('evaluation3: ' + expression3 + ' = ', result);
    }
}