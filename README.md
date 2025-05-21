# Recipe Trove

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Replace with your actual license if different -->
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://semver.org) <!-- Update with your project version -->

Welcome to Recipe Trove, your personal and private recipe haven! This project provides a simple, self-hostable way to store, manage, and access your favorite recipes.

<!-- Optional: Add a screenshot or GIF of your project in action -->
<!-- ![Recipe Trove Screenshot](path/to/your/screenshot.png) -->

## Table of Contents

* [About The Project](#about-the-project)
* [Features](#features)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Starting the Server](#starting-the-server)
  * [Accessing the Application](#accessing-the-application)
  * [Adding Recipes](#adding-recipes)
  * [Configuration](#configuration)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

## About The Project

Recipe Trove is designed for individuals who want a straightforward, private solution for managing their recipe collection without relying on third-party services. It's built with simplicity in mind, allowing you to quickly get set up and start adding your culinary creations.

Your recipes are stored locally in a `recipes.db` SQLite database file, ensuring you always have control over your data.

## Features

*   **Self-Hosted:** Keep your recipes private and under your control.
*   **Simple Recipe Management:** Easily add new recipes.
*   **SQLite Backend:** Lightweight and file-based database for easy backup and management.
*   **Google Image Search Integration (Optional):** Enhance your recipes with images.
*   **Customizable Port:** Run the application on your preferred network port.

## Getting Started

Follow these instructions to get your local instance of Recipe Trove up and running.

### Prerequisites

*   Node.js and npm (or yarn) installed on your machine.
    *   You can download Node.js (which includes npm) from nodejs.org.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gonfalon/recipe-trove.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd recipe-trove
    ```
3.  **Install dependencies:**
    If you're using npm:
    ```bash
    npm install
    ```
    Or, if you prefer yarn:
    ```bash
    yarn install
    ```

## Usage

### Starting the Server

Once the installation is complete, you can start the application server:

```bash
node server.js
```

The console will output a message indicating the server is running and on which port.

### Accessing the Application

By default, Recipe Trove runs on port 2369. Open your web browser and navigate to:

```
http://localhost:2369
```

If you have configured a custom port using the `TROVE_PORT` environment variable (see Configuration), use that port number instead.

### Adding Recipes

To add new recipes, navigate to the `./add.html` page in your browser:

```
http://localhost:2369/add.html
```

### Configuration

Recipe Trove can be configured using environment variables:

*   **`TROVE_PORT`**: Sets the port on which the application will run.
    *   Example: `TROVE_PORT=8080 node server.js`
*   **`CSE_ID`**: Your Google Custom Search Engine ID. Required for Google Image search integration.
*   **`GOOGLE_API_KEY`**: Your Google API Key. Required for Google Image search integration.

To set environment variables, you can either prefix them before the run command (as shown above) or set them in your shell environment, or use a `.env` file with a library like `dotenv` (if you choose to integrate it into the project).

**Setting up Google Image Search:**
To enable the Google Image search feature for your recipes:
1.  You'll need to create a Custom Search Engine (CSE) and get an API key from Google Cloud.
2.  Follow the instructions here for a guide on generating these keys.
3.  Set the `CSE_ID` and `GOOGLE_API_KEY` environment variables with the values you obtained.

## Contributing

Contributions are welcome and greatly appreciated! If you have suggestions for improving Recipe Trove, please feel free to:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

You can also open an issue with the tag "enhancement" or "bug".

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Maintainer: [Ben Dunphy](https://github.com/gonfalon)