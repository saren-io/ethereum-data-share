import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';
import File from '../abis/File.json'

// IPFS http code
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'}); // leaving out the arguments will default to these values


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            buffer: null,
            contract: null,
            fileHash: "QmPpNuwSi9ctTHTafxkFQ5tGASfRqmmxhgdiYbbUqNeeWD",
            fileStatus: "Not Uploaded",
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

    captureFile = (e) => {
        e.preventDefault();
        console.log("file captured...");
        this.setState({fileStatus: "File Captured"});

        //Process file for ipfs
        let file = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({buffer: Buffer(reader.result)});
        };
    };

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
    onSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form...");
        this.setState({fileStatus: "Uploading File"});

        //Add file to ipfs
        ipfs.add(this.state.buffer, (err, result) => {

            if (err) {
                console.log(err);
                this.setState({fileStatus: err.toString()});
                return
            }
            const hash = result[0].hash;

            // Store file on Blockchain
            this.state.contract.methods.set(hash).send({from: this.state.account}).on("confirmation", (r) => {
                this.setState({fileHash: hash});
                this.setState({fileStatus: "File Uploaded Successfully"});
                console.log("File uploaded successfully...");
            });
        });
    };

    test = (e) => {
        e.preventDefault();
        console.log("Code: ", this.state.unitCode);
        console.log("Marks: ", this.state.unitMarks);
        let code = this.state.unitCode;
        let marks = this.state.unitMarks;
        let ID = this.state.studentID;
        let loadData = ID + "-" + code + "-" + marks + ":";


        // Store file on Blockchain
        this.state.contract.methods.set(loadData).send({from: this.state.account}).on("confirmation", (r) => {
            console.log("Data stored on chain...");

            this.state.contract.methods.get().call().then((v) => {
                this.setState({data: v});
                console.log("data fetched from blockchain");
            });
        });
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
                        <small className="text-white"><strong> File Status:</strong> {this.state.fileStatus}&nbsp;&nbsp;</small>
                    </span>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <br/>
                                <h2>Data: {this.state.data}</h2>
                                <br/>
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
                                </form>
                                <button type="button" onClick={this.test} className="premium-button">Click</button>

                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
