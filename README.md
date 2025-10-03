```text
          :::     :::::::::: :::::::: ::::::::::: :::::::: 
       :+: :+:   :+:       :+:    :+:    :+:    :+:    :+: 
     +:+   +:+  +:+       +:+           +:+    +:+         
   +#++:++#++: +#++:++#  :#:           +#+    +#++:++#++   
  +#+     +#+ +#+       +#+   +#+#    +#+           +#+    
 #+#     #+# #+#       #+#    #+#    #+#    #+#    #+#     
###     ### ########## ######## ########### ########       
```

# Aegis: AI-Powered Pipeline Security Scanner

Aegis is a command-line tool that uses AI to scan your project and provide intelligent security recommendations for your CI/CD pipeline and infrastructure configurations. It analyzes your project's context and leverages a powerful language model to deliver tailored, expert-level advice.

## Features

- **Context-Aware Scanning:** Automatically scans your project for key infrastructure and dependency files, including:
  - `package.json`
  - `Dockerfile`
  - GitHub Actions workflows (`.github/workflows`)

- **AI-Powered Analysis:** Gathers all the contextual information from your project and sends it to an AI model, which acts as a senior security engineer to provide you with:
  - **Tailored Recommendations:** Security advice that is specific to your project's dependencies and infrastructure.
  - **Performance Considerations:** Suggestions that balance security with pipeline performance and execution time.
  - **Actionable Snippets:** Ready-to-use code snippets for CI/CD and Dockerfile configurations.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/annaluizando/aegis.git
    cd aegis
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Compile the TypeScript code:
    ```bash
    npm run build
    ```

4.  Link the package to make the command available globally:
    ```bash
    npm link
    ```

5.  Set up your environment:
    Create a `.env` file in the root of the project and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_api_key_here
    ```

## Usage

To scan a project, run the `aegis` command and provide the path to the project directory you want to analyze.

```bash
aegis /path/to/your/project
```

The tool will then output the AI's analysis and recommendations to the console.

## Running Tests

To run the unit tests, use the following command:

```bash
npm test
```

## License

This project is licensed under the ISC License.
