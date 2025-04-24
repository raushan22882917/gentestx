/**
 * Calculator class that provides basic arithmetic operations
 */
class Calculator {
  /**
   * Adds two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  add(a, b) {
    return a + b;
  }

  /**
   * Subtracts second number from first number
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  subtract(a, b) {
    return a - b;
  }

  /**
   * Multiplies two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   */
  multiply(a, b) {
    return a * b;
  }

  /**
   * Divides first number by second number
   * @param {number} a - First number (dividend)
   * @param {number} b - Second number (divisor)
   * @returns {number} Quotient of a and b
   * @throws {Error} If divisor is zero
   */
  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }

  /**
   * Calculates the power of a number
   * @param {number} base - The base number
   * @param {number} exponent - The exponent
   * @returns {number} The result of base raised to the power of exponent
   */
  power(base, exponent) {
    return Math.pow(base, exponent);
  }

  /**
   * Calculates the square root of a number
   * @param {number} value - The number to calculate square root for
   * @returns {number} The square root of the value
   * @throws {Error} If value is negative
   */
  squareRoot(value) {
    if (value < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(value);
  }
}

module.exports = Calculator;
