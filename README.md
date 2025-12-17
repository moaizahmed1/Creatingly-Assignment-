
## About The Project

This project focuses on automating the core functionalities of `app.diagrams.net`. The primary goal is to ensure the reliability and stability of the diagram creation and manipulation features. The tests simulate user interactions to validate the application's behavior.

## Built With

* [Cypress](https://www.cypress.io/)
* [JavaScript (ES6)](https://www.javascript.com/)
* [Node.js](https://nodejs.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

## Usage

Cypress can be run in two modes: interactive (with a UI) or headless (in the command line).

### Interactive Mode

To open the Cypress Test Runner UI:

```sh
npx cypress open
```

### Headless Mode

To run the tests in headless mode in the Chrome browser (records a video of the test run):

```sh
npx cypress run --browser chrome
```

To run a specific test file in headless mode:

```sh
npx cypress run --browser chrome --spec cypress/e2e/diagram.cy.js
```

## Test Coverage

The following functionalities are covered by the automation tests:

*   **Application Launch:** Opens the `app.diagrams.net` application.
*   **Shape Manipulation:**
    *   Drags and drops shapes onto the canvas.
    *   Moves and resizes shapes on the canvas.
*   **Connectivity:** Connects shapes with arrows.
*   **Text Editing:** Edits the text within a shape.
*   **History:** Performs undo and redo actions.
*   **Deletion:** Deletes shapes from the canvas.