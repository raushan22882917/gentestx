const fs = require('fs');
const { analyzeCodeWithGroq } = require('./groqService');
const { generateTests } = require('./testGenerator');

// Mock VSCode API
global.vscode = {
  workspace: {
    getConfiguration: () => ({
      get: (key) => {
        if (key === 'groqApiKey') return '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';
        if (key === 'outputLocation') return 'sameDirectory';
        if (key === 'testFramework') return 'jest';
        return null;
      }
    })
  },
  window: {
    showInformationMessage: console.log,
    showErrorMessage: console.error
  }
};

async function testExtension() {
  try {
    console.log('Reading sample code...');
    const sampleCode = fs.readFileSync('./sampleCode.js', 'utf8');
    
    console.log('Analyzing code with Groq API...');
    const analysisResult = await analyzeCodeWithGroq(sampleCode, 'javascript');
    
    console.log('Analysis result:');
    console.log('-----------------------------------');
    console.log(analysisResult);
    console.log('-----------------------------------');
    
    console.log('Generating tests...');
    const testCode = await generateTests(analysisResult, sampleCode, 'javascript');
    
    console.log('Generated test code:');
    console.log('-----------------------------------');
    console.log(testCode);
    console.log('-----------------------------------');
    
    // Save the generated test code to a file
    fs.writeFileSync('./sampleCode.test.js', testCode, 'utf8');
    console.log('Test code saved to sampleCode.test.js');
  } catch (error) {
    console.error('Error testing extension:', error);
  }
}

testExtension();
