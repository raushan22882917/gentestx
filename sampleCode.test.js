const Calculator = require('./sampleCode');

describe('Calculator class', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    calculator = null;
  });

  it('adds two positive numbers', () => {
    // Arrange
    const a = 2;
    const b = 3;
    const expectedOutput = 5;

    // Act
    const result = calculator.add(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('adds two negative numbers', () => {
    // Arrange
    const a = -2;
    const b = -3;
    const expectedOutput = -5;

    // Act
    const result = calculator.add(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('adds a positive and a negative number', () => {
    // Arrange
    const a = 2;
    const b = -3;
    const expectedOutput = -1;

    // Act
    const result = calculator.add(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('throws error when adding two numbers with non-numeric inputs', () => {
    // Arrange
    const a = 'a';
    const b = 2;

    // Act and Assert
    expect(() => calculator.add(a, b)).toThrowError('Error: Non-numeric input');
  });

  it('subtracts two positive numbers', () => {
    // Arrange
    const a = 5;
    const b = 2;
    const expectedOutput = 3;

    // Act
    const result = calculator.subtract(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('subtracts two negative numbers', () => {
    // Arrange
    const a = -5;
    const b = -2;
    const expectedOutput = -3;

    // Act
    const result = calculator.subtract(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('subtracts a positive and a negative number', () => {
    // Arrange
    const a = 5;
    const b = -2;
    const expectedOutput = 7;

    // Act
    const result = calculator.subtract(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('throws error when subtracting two numbers with non-numeric inputs', () => {
    // Arrange
    const a = 'a';
    const b = 2;

    // Act and Assert
    expect(() => calculator.subtract(a, b)).toThrowError('Error: Non-numeric input');
  });

  it('multiplies two positive numbers', () => {
    // Arrange
    const a = 2;
    const b = 3;
    const expectedOutput = 6;

    // Act
    const result = calculator.multiply(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('multiplies two negative numbers', () => {
    // Arrange
    const a = -2;
    const b = -3;
    const expectedOutput = 6;

    // Act
    const result = calculator.multiply(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('multiplies a positive and a negative number', () => {
    // Arrange
    const a = 2;
    const b = -3;
    const expectedOutput = -6;

    // Act
    const result = calculator.multiply(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('throws error when multiplying two numbers with non-numeric inputs', () => {
    // Arrange
    const a = 'a';
    const b = 2;

    // Act and Assert
    expect(() => calculator.multiply(a, b)).toThrowError('Error: Non-numeric input');
  });

  it('divides two positive numbers', () => {
    // Arrange
    const a = 6;
    const b = 2;
    const expectedOutput = 3;

    // Act
    const result = calculator.divide(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('divides two negative numbers', () => {
    // Arrange
    const a = -6;
    const b = -2;
    const expectedOutput = 3;

    // Act
    const result = calculator.divide(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('divides a positive and a negative number', () => {
    // Arrange
    const a = 6;
    const b = -2;
    const expectedOutput = -3;

    // Act
    const result = calculator.divide(a, b);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('throws error when dividing by zero', () => {
    // Arrange
    const a = 6;
    const b = 0;

    // Act and Assert
    expect(() => calculator.divide(a, b)).toThrowError('Error: Division by zero is not allowed');
  });

  it('throws error when dividing two numbers with non-numeric inputs', () => {
    // Arrange
    const a = 'a';
    const b = 2;

    // Act and Assert
    expect(() => calculator.divide(a, b)).toThrowError('Error: Non-numeric input');
  });

  it('calculates power of two positive numbers', () => {
    // Arrange
    const base = 2;
    const exponent = 3;
    const expectedOutput = 8;

    // Act
    const result = calculator.power(base, exponent);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('calculates power of two negative numbers', () => {
    // Arrange
    const base = -2;
    const exponent = -3;
    const expectedOutput = -8;

    // Act
    const result = calculator.power(base, exponent);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('calculates power of a positive and a negative number', () => {
    // Arrange
    const base = 2;
    const exponent = -3;
    const expectedOutput = 0.125;

    // Act
    const result = calculator.power(base, exponent);

    // Assert
    expect(result).toBeCloseTo(expectedOutput, 5);
  });

  it('throws error when calculating power of two numbers with non-numeric inputs', () => {
    // Arrange
    const base = 'a';
    const exponent = 2;

    // Act and Assert
    expect(() => calculator.power(base, exponent)).toThrowError('Error: Non-numeric input');
  });

  it('calculates square root of a positive number', () => {
    // Arrange
    const value = 9;
    const expectedOutput = 3;

    // Act
    const result = calculator.squareRoot(value);

    // Assert
    expect(result).toBe(expectedOutput);
  });

  it('throws error when calculating square root of a negative number', () => {
    // Arrange
    const value = -9;

    // Act and Assert
    expect(() => calculator.squareRoot(value)).toThrowError('Error: Cannot calculate square root of negative number');
  });

  it('throws error when calculating square root of a non-numeric input', () => {
    // Arrange
    const value = 'a';

    // Act and Assert
    expect(() => calculator.squareRoot(value)).toThrowError('Error: Non-numeric input');
  });
});
