Ethereum File Share Client &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jaykch/ethereum-file-share/blob/master/LICENSE)
=======
  <h3 align="center">Check out the demo on youtube</h3>

  <p align="center">
    An awesome project to upload data on a website and authenticating it through ethereum smart contracts!
    <br />
    This project is a proof of concept for storing University Transcripts on Blockchain.
    <br />
    <a href="https://youtu.be/jasEMlDE0Bs">View Demo</a>
    ·
    <a href="https://github.com/jaykch/ethereum-data-share/issues">Report Bug</a>
  </p>
</p>

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Deployment](#deployment)
* [Demo](#demo-and-description)
* [Author](#author)
* [License](#license)
* [Acknowledgements](#acknowledgments)

## About The Project
This project uses React.JS for front end and Ethereum smart contracts for storing the data on a blockchain. Below is the entire process from entering data to uploading it to a private Blockchain and displaying it on a website

* **Admin Panel Login:**  First you enter a password to log into the system to input data. 
* **Adding Data:**  You input the transcript data into respective fields.
* **Submitting:**  After adding data, once you click on the submit button, the server uploads the data to a private Ethereum Blockchain using Ganache.
* **Logging Into View:**  Once the data is uploaded successfully, you log into a separate website with a password to view it.
* **Fetching Data:**  On login the client fetches data and populates the fields.
* **Updating:**  Data can be updated on the Blockchain through the admin panel and once confirmation notification is received, the new data can be fetched via the update button on the view window.

### Built With
This project uses the following software and languages
* [Javascript](https://www.javascript.com/)
* [Web3](https://github.com/ethereum/web3.js/)
* [React.JS](https://reactjs.org/)
* [WebStorm IDE](https://www.jetbrains.com/webstorm/)
* [Solidity](https://github.com/ethereum/solidity/)
* [Ganache](https://www.trufflesuite.com/ganache/)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Here is the list of all the prerequisites you would need to install on your system in order to run this device
* Node.js v10.15.3
```sh
https://nodejs.org/en/download/
```
* npm
```sh
https://www.npmjs.com/get-npm
```
* Truffle
```sh
https://www.trufflesuite.com
```

* Additional build tools are required to be able to run this project on windows. Run these commands from an 
administrative shell to install software dependencies:
<br/><br/>**_Note:_** _You need to install windows build tools version 4.0 or higher_ <br/><br/>
```sh
npm install --global --production windows-build-tools
npm install -g node-gyp
```

<!-- TABLE OF CONTENTS -->

### Installation
1. Add all dependencies using npm
    ```sh
    npm install
    ```
2. Open Ganache and run a private Blockchain

3. Run Truffle to add smart contract to the Blockchain
    ```sh
    truffle migrate --reset
    ```
    You will get the following feedback from console: 
    <br/><br/>
    ![Port Image](assets/migrate.PNG?raw=true "Port")
    
4. Run server to start the React.JS client
    ```sh
    npm start
    ```
**_Note:_** _You need to keep running Ganache for the app to work. Please go through the deployment below to start using your client._

## Deployment

Run 
```sh
npm build
```
You need to connect to Rinkeby or Ropsten test network if you do not want to spend any money on Ethereum smart contracts via the Mainnet.

## Demo and Description
Check out the demo on youtube here - <a href="https://youtu.be/jasEMlDE0Bs">View Demo</a> <br/><br/>

## Author
* **Jay Kumar** - *Complete Development* - [jaykch.com](http://www.jaykch.com/)

## License
This project is licensed under the MIT License - see the [LICENSE.md](/LICENSE) file for details

## Acknowledgments

* [Boilerplate](https://github.com/dappuniversity/starter_kit) - Boilerplate for React.JS + Ethereum + Truffle project.