let errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));

// --------------- Step 2 - Adding Buttons for Console Testing ---------------

const buttons = document.querySelectorAll('#error-btns > button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const label = button.textContent.trim();

        switch (label) {
        case 'Console Log':
            console.log('Console Log Demo: hellooooo world!');
            break;

        case 'Console Error':
            console.error('Console Error Demo: uh ohhh spaghettio!');
            break;

        case 'Console Count':
            console.count('Click Counter');
            break;

        case 'Console Warn':
            console.warn('Console Warn Demo: This is a warning message.');
            break;

        case 'Console Assert':
            const expectedValue = 10;
            const actualValue = 5;
            console.assert(actualValue === expectedValue, `actualValue (${actualValue}) does not equal expectedValue (${expectedValue})`);
            break;

        case 'Console Clear':
            console.clear();
            break;

        case 'Console Dir':
            // console.dir displays an interactive list of the properties of a specified JavaScript object
            console.dir(button);
            break;

        case 'Console dirxml':
            // console.dirxml displays an XML/HTML element tree representation
            console.dirxml(document.querySelector('form'));
            break;

        case 'Console Group Start':
            console.group('Lab 9');
            console.log('Step 1: Set Up');
            console.log('Step 2 - Adding Buttons for Console Testing');
            console.log('Step 3 - Trying Try/Catch');
            console.log('Step 4 - Throw and Custom Errors');
            console.log('Step 5 - The Global Error handler and 3rd Party Tracking');
            break;

        case 'Console Group End':
            console.groupEnd('Lab 9');
            break;

        case 'Console Table':
            console.table([
            { title: 'Software Engineering', id: 'CSE110' },
            { title: 'Database System Principles', id: 'CSE132A' },
            { title: 'The Myth of the Self, the Myth of Time', id: `CAT125`},
            { title: 'Design and Analysis of Algorithms', id: 'CSE101'}
            ]);
            break;

        case 'Start Timer':
            console.time('Lab 9 Timer');
            console.log('Timer started...');
            break;

        case 'End Timer':
            // Ensure the label matches exactly what was passed to console.time()
            console.timeEnd('Lab 9 Timer');
            break;

        case 'Console Trace':
            // Creates a stack trace to show the execution path
            function traceOrigin() {
            function traceMidpoint() {
                console.trace('Trace Stack:');
            }
            traceMidpoint();
            }
            traceOrigin();
            break;

        case 'Trigger a Global Error':
            // step 5
            console.log("Intentionally forcing an unhandled runtime error...");
        
            // Calling a function that completely does not exist will trigger 
            // a native ReferenceError, which slips past local try/catch blocks.
            executeNonExistentFunction(); 
            break;

        default:
            console.log(`Unknown button action: ${label}`);
        }
    });
});

// --------------- Step 3 - Trying Try/Catch ---------------
let form = document.querySelector('form');

form.addEventListener('submit', e => {
    e.preventDefault();
    let output = document.querySelector('output');
    
    try {
        let firstNumElem = document.querySelector('#first-num');
        let secondNumElem = document.querySelector('#second-num');
        let operatorElem = document.querySelector('#operator');
        
        if (!firstNumElem || !secondNumElem || !operatorElem || !output) {
            throw new Error("Critical UI elements are missing from the DOM tree.");
        }

        let firstNum = firstNumElem.value;
        let secondNum = secondNumElem.value;
        let operator = operatorElem.value;

        // Throwing your shiny new Custom Error if a field is completely empty
        if (firstNum.trim() === "" || secondNum.trim() === "") {
            throw new CalculatorValidationError("Inputs cannot be left blank.");
        }
        
        if (isNaN(firstNum) || isNaN(secondNum)) {
            throw new TypeError("Inputs must be valid numeric expressions.");
        }

        if (operator === '/' && parseFloat(secondNum) === 0) {
            throw new RangeError("Cannot divide by zero. Result evaluates to Infinity.");
        }

        let result = eval(`${firstNum} ${operator} ${secondNum}`);
        output.innerHTML = result;

    } catch (error) {
        // Step 4 Core Feature: Group and filter based on error lineage
        console.error("An error was safely caught inside the calculator pipeline:");
        
        if (error instanceof CalculatorValidationError) {
            // This blocks logs cleanly only for your custom validation rule
            console.warn(`[Custom Validation] Type: ${error.name} | Msg: ${error.message}`);
            output.innerHTML = `Validation Error: ${error.message}`;
        } else if (error instanceof RangeError || error instanceof TypeError) {
            // This blocks logs native Javascript math/type bugs
            console.error(`[Engine Error] Type: ${error.name} | Msg: ${error.message}`);
            output.innerHTML = `Calculation Error: ${error.message}`;
        } else {
            // Fallback fallback mechanism
            console.error(`[Unknown Exception]: ${error.message}`);
            output.innerHTML = `Unexpected Error occurred.`;
        }

    } finally {
        console.log("Calculator transaction attempt finalized.");
    }
});

// --------------- Step 4 - Throw and Custom Errors ---------------
class CalculatorValidationError extends Error {
    constructor(message) {
        super(message);
        
        // Explicitly overwrite the generic "Error" name with your custom class name
        this.name = "CalculatorValidationError";
    }
}

// --------------- Step 5 - The Global Error handler and 3rd Party Tracking ---------------
window.onerror = function (message, source, lineno, colno, error) {
    console.log("⚓ [Global Error Interceptor]: A wild unhandled exception was caught!");
    console.error(`Details: "${message}" at file: ${source}, line: ${lineno}:${colno}`);
    
    // Returning false allows the default browser behavior to still run (prints the red error in console).
    // Returning true would completely silence the error from hitting the browser console.
    return false; 
};