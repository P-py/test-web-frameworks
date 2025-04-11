import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true, // Adicione esta linha
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  display: string = '0';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitingForSecondOperand: boolean = false;

  inputDigit(digit: string): void {
    if (this.waitingForSecondOperand) {
      this.display = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? digit : this.display + digit;
    }
  }

  inputDecimal(): void {
    if (this.waitingForSecondOperand) {
      this.display = '0.';
      this.waitingForSecondOperand = false;
      return;
    }

    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  handleOperator(nextOperator: string): void {
    const inputValue = parseFloat(this.display);

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.calculate();
      this.display = String(result);
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }

  calculate(): number {
    if (this.firstOperand === null || this.operator === null) return 0;

    const inputValue = parseFloat(this.display);
    let result = 0;

    switch (this.operator) {
      case '+':
        result = this.firstOperand + inputValue;
        break;
      case '-':
        result = this.firstOperand - inputValue;
        break;
      case '*':
        result = this.firstOperand * inputValue;
        break;
      case '/':
        result = this.firstOperand / inputValue;
        break;
    }

    return result;
  }

  clear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }
}