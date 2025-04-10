// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="calculator-container">
      <h1>Calculadora Angular</h1>
      <div class="display">{{ displayValue }}</div>
      <div class="buttons">
        <div class="button-row">
          <button (click)="clear()">C</button>
          <button (click)="handleOperator('/')">/</button>
          <button (click)="handleOperator('*')">×</button>
          <button (click)="backspace()">⌫</button>
        </div>
        <div class="button-row">
          <button (click)="appendNumber('7')">7</button>
          <button (click)="appendNumber('8')">8</button>
          <button (click)="appendNumber('9')">9</button>
          <button (click)="handleOperator('-')">-</button>
        </div>
        <div class="button-row">
          <button (click)="appendNumber('4')">4</button>
          <button (click)="appendNumber('5')">5</button>
          <button (click)="appendNumber('6')">6</button>
          <button (click)="handleOperator('+')">+</button>
        </div>
        <div class="button-row">
          <button (click)="appendNumber('1')">1</button>
          <button (click)="appendNumber('2')">2</button>
          <button (click)="appendNumber('3')">3</button>
          <button (click)="calculate()" class="equals">=</button>
        </div>
        <div class="button-row">
          <button (click)="appendNumber('0')" class="zero">0</button>
          <button (click)="appendDecimal()">.</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calculator-container {
      max-width: 300px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      font-family: Arial, sans-serif;
    }
    
    h1 {
      text-align: center;
      color: #333;
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 24px;
    }
    
    .display {
      background-color: #fff;
      padding: 15px;
      margin-bottom: 20px;
      text-align: right;
      font-size: 24px;
      border-radius: 5px;
      box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
      min-height: 30px;
      overflow: hidden;
      word-wrap: break-word;
    }
    
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .button-row {
      display: flex;
      gap: 10px;
    }
    
    button {
      flex: 1;
      padding: 15px;
      font-size: 18px;
      background-color: #e0e0e0;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #d0d0d0;
    }
    
    button:active {
      background-color: #c0c0c0;
    }
    
    .equals {
      background-color: #4caf50;
      color: white;
      grid-row: span 2;
    }
    
    .equals:hover {
      background-color: #45a049;
    }
    
    .zero {
      flex: 2;
    }
  `]
})
export class AppComponent {
  displayValue = '0';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitingForSecondOperand = false;

  clear() {
    this.displayValue = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  backspace() {
    if (this.displayValue.length > 1) {
      this.displayValue = this.displayValue.slice(0, -1);
    } else {
      this.displayValue = '0';
    }
  }

  appendNumber(number: string) {
    if (this.waitingForSecondOperand) {
      this.displayValue = number;
      this.waitingForSecondOperand = false;
    } else {
      this.displayValue = this.displayValue === '0' ? number : this.displayValue + number;
    }
  }

  appendDecimal() {
    if (this.waitingForSecondOperand) {
      this.displayValue = '0.';
      this.waitingForSecondOperand = false;
      return;
    }
    
    if (!this.displayValue.includes('.')) {
      this.displayValue += '.';
    }
  }

  handleOperator(operator: string) {
    const inputValue = parseFloat(this.displayValue);
    
    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.performCalculation(this.firstOperand, inputValue, this.operator);
      this.displayValue = String(result);
      this.firstOperand = result;
    }
    
    this.waitingForSecondOperand = true;
    this.operator = operator;
  }

  performCalculation(firstOperand: number, secondOperand: number, operator: string): number {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return secondOperand !== 0 ? firstOperand / secondOperand : 0;
      default:
        return secondOperand;
    }
  }

  calculate() {
    if (this.firstOperand === null || this.operator === null) {
      return;
    }
    
    const inputValue = parseFloat(this.displayValue);
    const result = this.performCalculation(this.firstOperand, inputValue, this.operator);
    
    this.displayValue = String(result);
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }
}