# GenTestX

![GenTestX Logo](media/icon.jpg)

GenTestX is a VSCode extension that analyzes your code and automatically generates comprehensive test cases using the Groq API.

## Features

- Analyzes the currently open file in VSCode
- Generates comprehensive test cases based on the code analysis
- Supports multiple programming languages (JavaScript, TypeScript, Python, Java)
- Interactive UI for visualizing analysis and test cases
- Configurable test framework selection
- Customizable output location for generated tests
- Status bar integration for quick access

## Requirements

- Visual Studio Code 1.60.0 or higher
- Internet connection to access the Groq API

## Installation

1. Install the extension from the VSCode Marketplace
2. Configure your Groq API key in the extension settings (optional, a default key is provided)

## Usage

1. Open a file you want to generate tests for
2. Click on the "GenTestX" icon in the status bar or run the command "GenTestX: Generate Tests for Current File" from the Command Palette (Ctrl+Shift+P)
3. The GenTestX UI panel will open, showing the analysis progress
4. Wait for the analysis and test generation to complete
5. Review the generated test cases in the UI panel
6. The generated test file will be saved and opened automatically

## Extension Settings

This extension contributes the following settings:

* `gentestx.groqApiKey`: Your Groq API key for authentication
* `gentestx.outputLocation`: Where to save the generated test files (same directory or test directory)
* `gentestx.testFramework`: Test framework to use for generated tests (auto, jest, mocha, pytest, unittest)

## How It Works

1. The extension extracts the code from your currently open file
2. It sends the code to the Groq API for analysis
3. The API analyzes the code and identifies possible test scenarios
4. The extension generates test code based on the analysis
5. The generated test file is saved to the specified location

## Supported Languages and Test Frameworks

| Language | Supported Test Frameworks |
|----------|---------------------------|
| JavaScript | Jest, Mocha |
| TypeScript | Jest, Mocha |
| Python | pytest, unittest |
| Java | JUnit |

## License

This extension is licensed under the MIT License.

## Privacy

This extension sends your code to the Groq API for analysis. Please review Groq's privacy policy for information on how your data is handled.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Open the project in VSCode
4. Press F5 to start debugging

### Building

To package the extension:

```bash
vsce package
```

This will create a .vsix file that can be installed in VSCode.

## Credits

- Powered by [Groq API](https://groq.com/)
- Built with [Visual Studio Code Extension API](https://code.visualstudio.com/api)
