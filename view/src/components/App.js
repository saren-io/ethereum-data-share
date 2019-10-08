import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';
import File from '../abis/File.json';

import {ToastsContainer, ToastsStore} from 'react-toasts';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            status: "Not Uploaded",
            unitCode: '',
            unitMarks: '',
            studentID: '',
            data: ''
        }
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
    }

    async loadBlockChainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        const networkId = await web3.eth.net.getId();
        const networkData = File.networks[networkId];
        if (networkData) {
            const abi = File.abi;
            const address = networkData.address;
            // Fetch smart contract
            const contract = web3.eth.Contract(abi, address);
            this.setState({contract});
            const fileHash = await contract.methods.get().call();
            this.setState({fileHash});
        } else {
            window.alert('Smart contract not deployed to detected network');
        }
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Please install MetaMask!')
        }
    }

    fetchData = (e) => {
        e.preventDefault();
        this.state.contract.methods.get().call().then((v) => {
            console.log("Data fetched from Blockchain...");
            this.setState({data: v});
            this.updateData();
            ToastsStore.success("Data fetched successfully!");
        });
    };

    updateData = () => {
        let data = this.state.data.split(":");
        let studentData = data[0].split("-");

        let studentID = studentData[0];
        let unitCode = studentData[1];
        let unitMarks = studentData[2];

        this.setState({studentID, unitCode, unitMarks});
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.jaykch.com/"
                       target="_blank" rel="noopener noreferrer">
                        Ethereum Data Share
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><strong>Account
                                Connected:</strong> {this.state.account.length > 0 ? this.state.account : "Not Connected!"}
                            </small>
                        </li>
                    </ul>
                    <span className="nav-item text-nowrap">
                        <small className="text-white"><strong>Status:</strong> {this.state.status}&nbsp;&nbsp;</small>
                    </span>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <ToastsContainer store={ToastsStore}/>
                        <main role="main" className="col-lg-12 d-flex text-center">
                            {}
                            <div className="content mr-auto ml-auto">
                                <br/>
                                <div>{this.state.data ?
                                    <div>
                                        <h2>Student ID: {this.state.studentID}</h2>
                                        <h2>Course Code: {this.state.unitCode}</h2>
                                        <h2>Marks: {this.state.unitMarks}</h2>
                                    </div>
                                    : <h2>Data not loaded!</h2>}</div>
                                <br/>
                                <button type="button" onClick={this.fetchData} className="premium-button">Fetch</button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
