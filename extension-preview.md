# GenTestX Extension Preview

## Extension in VSCode Marketplace

![Marketplace Preview](https://i.imgur.com/example.png)

## Features

### 1. Generate Tests with One Click

![Generate Tests](https://i.imgur.com/example.png)

### 2. Interactive UI for Test Generation

![UI Panel](https://i.imgur.com/example.png)

### 3. Detailed Analysis of Your Code

![Code Analysis](https://i.imgur.com/example.png)

### 4. Comprehensive Test Cases

![Test Cases](https://i.imgur.com/example.png)

## How to Install

1. Download the VSIX file
2. Run the install-extension.bat script
3. Or install manually in VSCode:
   - Go to Extensions view (Ctrl+Shift+X)
   - Click on "..." menu
   - Select "Install from VSIX..."
   - Select the gentestx-0.1.0.vsix file

## How to Use

1. Open a file you want to generate tests for
2. Click on the "GenTestX" icon in the status bar or run the "GenTestX: Generate Tests for Current File" command
3. Wait for the analysis and test generation to complete
4. Review the generated test cases in the UI panel
5. The generated test file will be saved and opened automatically

## Publishing to Marketplace

To publish the extension to the VSCode Marketplace:

1. Create a publisher account on https://marketplace.visualstudio.com/
2. Get a Personal Access Token (PAT) from Azure DevOps
3. Run the following command:
   ```
   vsce publish -p <your-pat>
   ```

## Screenshots

### Extension UI
![Extension UI](https://i.imgur.com/example.png)

### Generated Tests
![Generated Tests](https://i.imgur.com/example.png)
