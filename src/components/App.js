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
            authenticated: '',
            contract: null,
            status: "Not Uploaded",
            unitCode: '',
            unitMarks: '',
            studentID: '',
            data: '',
            password: ''
        }
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
        await this.fetchData();
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

    updateUnit = (e) => {
        e.preventDefault();
        this.setState({unitCode: e.target.value});
    };


    updateMarks = (e) => {
        e.preventDefault();
        this.setState({unitMarks: e.target.value});
    };

    updateID = (e) => {
        e.preventDefault();
        this.setState({studentID: e.target.value});
    };

    updatePassword = (e) => {
        e.preventDefault();
        this.setState({password: e.target.value});
    };

    onSubmit = (e) => {
        e.preventDefault();
        let code = this.state.unitCode;
        let marks = this.state.unitMarks;
        let ID = this.state.studentID;
        this.state.data = this.state.data + ID + "-" + code + "-" + marks + ":";
        ToastsStore.warning("Adding data to Blockchain...");


        // Store data on Blockchain
        this.state.contract.methods.set(this.state.data).send({from: this.state.account}).on("confirmation", (r) => {
            console.log("Data stored on Blockchain...");
            ToastsStore.success("Data stored successfully!");
        });
    };

    reset = () => {
        this.state.data = "";
        ToastsStore.warning("Resetting data...");

        // Reset data on Blockchain
        this.state.contract.methods.set(this.state.data).send({from: this.state.account}).on("confirmation", (r) => {
            console.log("Data reset on Blockchain...");
            ToastsStore.success("Data reset successfull!");
        });
    };

    fetchData = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.state.contract.methods.get().call().then((v) => {
            console.log("Data fetched from Blockchain...");
            this.setState({data: v, status: "Data Loaded!"});
            console.log(this.state.data);
            ToastsStore.success("Data fetched successfully!");
        });
    };

    authenticate = (e) => {
        e.preventDefault();
        console.log("Authenticating...");

        if (this.state.password === "testing") {
            ToastsStore.success("You have logged in successfully!");
            this.setState({authenticated: true});
            console.log("Successfully authenticated!");
        } else {
            alert("Incorrect Password!");
            ToastsStore.error("Incorrect Password!");
        }
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.jaykch.com/"
                       target="_blank" rel="noopener noreferrer">
                        Admin Panel
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><strong>Account
                                Connected:</strong> {this.state.account.length > 0 ? this.state.account : "Not Connected!"}
                            </small>
                        </li>
                    </ul>
                    <span className="nav-item text-nowrap">
                        <small className="text-white"><strong> Status:</strong> {this.state.status}&nbsp;&nbsp;</small>
                    </span>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <ToastsContainer store={ToastsStore}/>
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <br/>
                                {this.state.authenticated ?
                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group row">
                                            <label htmlFor="studentID"
                                                   className="col-sm-12 col-form-label">Student ID:</label>
                                            <div className="col-sm-12">
                                                <input type="text" className="form-control" id="studentID"
                                                       value={this.state.studentID} placeholder="Enter Student ID!"
                                                       onChange={this.updateID}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="unitCode"
                                                   className="col-sm-12 col-form-label">Unit:</label>
                                            <div className="col-sm-12">
                                                <input type="text" className="form-control" id="unitCode"
                                                       value={this.state.unitCode} placeholder="Enter Unit Code!"
                                                       onChange={this.updateUnit}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="unitMarks"
                                                   className="col-sm-12 col-form-label">Marks:</label>
                                            <div className="col-sm-12">
                                                <input type="text" className="form-control" id="unitMarks"
                                                       value={this.state.unitMarks} placeholder="Enter Marks!"
                                                       onChange={this.updateMarks}/>
                                            </div>
                                        </div>
                                        <button type="button" onClick={this.onSubmit}
                                                className="premium-button">Submit
                                        </button>
                                        <button type="button" onClick={this.reset}
                                                className="premium-button">Reset Data
                                        </button>
                                    </form>
                                    :
                                    <div>
                                        <h2>Not Authenticated! </h2>
                                        <form onSubmit={this.authenticate}>
                                            <div className="form-group row">
                                                <label htmlFor="password"
                                                       className="col-sm-12 col-form-label">Password:</label>
                                                <div className="col-sm-12">
                                                    <input type="password" className="form-control" id="password"
                                                           value={this.state.password} placeholder="Enter Password"
                                                           onChange={this.updatePassword}/>
                                                </div>
                                            </div>
                                            <button type="button" onClick={this.authenticate}
                                                    className="premium-button">Submit
                                            </button>
                                        </form>
                                    </div>}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
