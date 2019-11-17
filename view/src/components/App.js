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
            status: "Data not loaded...",
            unitCode: '',
            unitMarks: '',
            studentID: '',
            data: '',
            students: [],
            password: ''
        }
    }

    authenticate = (e) => {
        e.preventDefault();
        console.log("Authenticating...");

        if (this.state.password === "testing") {
            ToastsStore.success("You have logged in successfully!");
            this.setState({authenticated: true});
        } else {
            alert("Incorrect Password!");
            ToastsStore.error("Incorrect Password!");
        }
    };

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
        this.fetchData();
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
        if (e) {
            e.preventDefault();
        }
        this.state.contract.methods.get().call().then((v) => {
            console.log("Data fetched from Blockchain...");
            this.setState({data: v, status: "Data Loaded!"});
            this.updateData();
            ToastsStore.success("Data fetched successfully!");
        });
    };

    updateData = () => {
        let data = this.state.data.split(":");
        this.state.students = this.state.data.split(":");
        let studentData = data[0].split("-");
        let studentID = studentData[0];
        let unitCode = studentData[1];
        let unitMarks = studentData[2];
        console.log(this.state.data);
        this.setState({studentID, unitCode, unitMarks});
    };

    updatePassword = (e) => {
        e.preventDefault();
        this.setState({password: e.target.value});
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.jaykch.com/"
                       target="_blank" rel="noopener noreferrer">
                        View Panel
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
                            <div className="content mr-auto ml-auto">
                                <br/>
                                <div>
                                    {this.state.authenticated ?
                                        <ul className="student-list">
                                            {
                                                this.state.students.map(function(item, i){
                                                    if(item.length>1){
                                                        let studentData = item.split("-");
                                                        let studentID = studentData[0];
                                                        let unitCode = studentData[1];
                                                        let unitMarks = studentData[2];

                                                        return <li key={i}>
                                                            <h2>Student ID: {studentID}</h2>
                                                            <h2>Course Code: {unitCode}</h2>
                                                            <h2>Marks: {unitMarks}</h2>
                                                        </li>
                                                    }
                                                })
                                            }

                                            <button type="button" onClick={this.fetchData}
                                                    className="premium-button">Update Data
                                            </button>
                                        </ul>

                                        : <div>
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

                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
