const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * Gets the programming language from the VSCode language ID
 * @param {string} languageId - The VSCode language ID
 * @returns {string|null} - The normalized language name or null if unsupported
 */
function getFileLanguage(languageId) {
    const languageMap = {
        'javascript': 'javascript',
        'typescript': 'typescript',
        'python': 'python',
        'java': 'java',
        'javascriptreact': 'javascript',
        'typescriptreact': 'typescript'
    };
    
    return languageMap[languageId] || null;
}

/**
 * Determines the output path for the generated test file
 * @param {string} sourcePath - The path of the source file
 * @param {string} language - The programming language
 * @returns {Promise<string>} - The path for the test file
 */
async function getOutputPath(sourcePath, language) {
    const config = vscode.workspace.getConfiguration('gentestx');
    const outputLocation = config.get('outputLocation');
    
    const sourceDir = path.dirname(sourcePath);
    const sourceFileName = path.basename(sourcePath, path.extname(sourcePath));
    
    let testFileName = '';
    let testDir = '';
    
    // Determine test file name based on language
    switch (language) {
        case 'javascript':
        case 'typescript':
            testFileName = `${sourceFileName}.test${path.extname(sourcePath)}`;
            break;
        case 'python':
            testFileName = `test_${sourceFileName}${path.extname(sourcePath)}`;
            break;
        case 'java':
            testFileName = `${sourceFileName}Test${path.extname(sourcePath)}`;
            break;
        default:
            testFileName = `${sourceFileName}.test${path.extname(sourcePath)}`;
    }
    
    // Determine test directory based on configuration
    if (outputLocation === 'sameDirectory') {
        testDir = sourceDir;
    } else {
        // Try to find a test directory
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(sourcePath));
        
        if (!workspaceFolder) {
            // If no workspace folder, use same directory
            testDir = sourceDir;
        } else {
            // Look for common test directories
            const possibleTestDirs = [
                path.join(sourceDir, 'tests'),
                path.join(sourceDir, 'test'),
                path.join(sourceDir, '__tests__'),
                path.join(path.dirname(sourceDir), 'tests'),
                path.join(path.dirname(sourceDir), 'test'),
                path.join(path.dirname(sourceDir), '__tests__'),
                path.join(workspaceFolder.uri.fsPath, 'tests'),
                path.join(workspaceFolder.uri.fsPath, 'test')
            ];
            
            // Find the first existing test directory
            for (const dir of possibleTestDirs) {
                try {
                    const stats = await fs.promises.stat(dir);
                    if (stats.isDirectory()) {
                        testDir = dir;
                        break;
                    }
                } catch (error) {
                    // Directory doesn't exist, continue to next one
                }
            }
            
            // If no test directory found, create one next to the source file
            if (!testDir) {
                testDir = path.join(sourceDir, 'tests');
                try {
                    await fs.promises.mkdir(testDir, { recursive: true });
                } catch (error) {
                    console.error(`Error creating test directory: ${error.message}`);
                    testDir = sourceDir; // Fallback to source directory
                }
            }
        }
    }
    
    return path.join(testDir, testFileName);
}

module.exports = {
    getFileLanguage,
    getOutputPath
};
