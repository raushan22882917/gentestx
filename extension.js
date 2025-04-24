const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { analyzeCodeWithGroq } = require('./groqService');
const { generateTests, extractTestCases } = require('./testGenerator');
const { getOutputPath, getFileLanguage } = require('./utils');

/**
 * Manages GenTestX webview panels
 */
class GenTestXPanel {
    static currentPanel = undefined;
    static viewType = 'gentestx';

    static createOrShow(context) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (GenTestXPanel.currentPanel) {
            GenTestXPanel.currentPanel._panel.reveal(column);
            return GenTestXPanel.currentPanel;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            GenTestXPanel.viewType,
            'GenTestX',
            column || vscode.ViewColumn.One,
            {
                // Enable JavaScript in the webview
                enableScripts: true,

                // Restrict the webview to only load resources from the `media` directory
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'media'))
                ],

                // Retain context when hidden
                retainContextWhenHidden: true
            }
        );

        GenTestXPanel.currentPanel = new GenTestXPanel(panel, context);
        return GenTestXPanel.currentPanel;
    }

    constructor(panel, context) {
        this._panel = panel;
        this._context = context;
        this._disposables = [];

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'generateTests':
                        vscode.commands.executeCommand('gentestx.generateTests');
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    dispose() {
        GenTestXPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    _update() {
        const webview = this._panel.webview;

        // Set the HTML content
        webview.html = this._getHtmlForWebview(webview);
    }

    updateStatus(status, progress = 0) {
        if (this._panel) {
            this._panel.webview.postMessage({
                command: 'updateStatus',
                status,
                progress
            });
        }
    }

    updateFile(filePath) {
        if (this._panel) {
            this._panel.webview.postMessage({
                command: 'updateFile',
                file: path.basename(filePath)
            });
        }
    }

    updateAnalysis(analysis) {
        if (this._panel) {
            this._panel.webview.postMessage({
                command: 'updateAnalysis',
                analysis
            });
        }
    }

    updateTestCases(testCases) {
        if (this._panel) {
            this._panel.webview.postMessage({
                command: 'updateTestCases',
                testCases
            });
        }
    }

    updateTestCode(testCode) {
        if (this._panel) {
            this._panel.webview.postMessage({
                command: 'updateTestCode',
                testCode
            });
        }
    }

    reset() {
        if (this._panel) {
            this._panel.webview.postMessage({
                command: 'reset'
            });
        }
    }

    _getHtmlForWebview(webview) {
        // Get the local path to main script run in the webview
        const htmlPath = path.join(this._context.extensionPath, 'media', 'main.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        // Replace the nonce placeholder
        html = html.replace(/\${nonce}/g, nonce);

        return html;
    }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('GenTestX extension is now active!');

    // Register the command to open the UI panel
    context.subscriptions.push(
        vscode.commands.registerCommand('gentestx.openUI', () => {
            GenTestXPanel.createOrShow(context);
        })
    );

    // Register the command to generate tests
    context.subscriptions.push(
        vscode.commands.registerCommand('gentestx.generateTests', async function () {
            // Create or show the panel
            const panel = GenTestXPanel.createOrShow(context);
            panel.reset();

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found. Please open a file to generate tests.');
                panel.updateStatus('error');
                return;
            }

            const document = editor.document;
            const fileContent = document.getText();
            const filePath = document.uri.fsPath;
            const language = getFileLanguage(document.languageId);

            if (!language) {
                vscode.window.showErrorMessage('Unsupported file type. GenTestX supports JavaScript, TypeScript, Python, and Java files.');
                panel.updateStatus('error');
                return;
            }

            // Update UI with file info
            panel.updateFile(filePath);
            panel.updateStatus('analyzing', 25);

            try {
                // Step 1: Analyze code with Groq API
                const analysisResult = await analyzeCodeWithGroq(fileContent, language);

                // Update UI with analysis result
                panel.updateAnalysis(analysisResult);
                panel.updateStatus('analyzing', 50);

                // Extract test cases from analysis
                const testCases = extractTestCases(analysisResult);
                panel.updateTestCases(testCases);
                panel.updateStatus('generating', 75);

                // Step 2: Generate test cases
                const testCode = await generateTests(analysisResult, fileContent, language);

                // Update UI with test code
                panel.updateTestCode(testCode);
                panel.updateStatus('success', 100);

                // Step 3: Save test file
                const outputPath = await getOutputPath(filePath, language);
                const testFileUri = vscode.Uri.file(outputPath);

                await vscode.workspace.fs.writeFile(
                    testFileUri,
                    Buffer.from(testCode, 'utf8')
                );

                // Step 4: Open the generated test file
                await vscode.window.showTextDocument(testFileUri);

                vscode.window.showInformationMessage(`Test file generated successfully at ${outputPath}`);
            } catch (error) {
                panel.updateStatus('error');
                vscode.window.showErrorMessage(`Error generating tests: ${error.message}`);
                console.error(error);
            }
        })
    );

    // Add a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(beaker) GenTestX";
    statusBarItem.tooltip = "Generate tests with GenTestX";
    statusBarItem.command = 'gentestx.openUI';
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
