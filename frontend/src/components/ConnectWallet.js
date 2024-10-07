import React, { useState, useEffect } from "react";
import { ConnectWallet } from "./ConnectWallet";

function App() {
    const [networkError, setNetworkError] = useState("");
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]); // Set the first account
                setNetworkError(""); // Clear any previous errors
            } catch (error) {
                console.error(error);
                setNetworkError("Failed to connect wallet. Please try again.");
            }
        } else {
            setNetworkError("Please install MetaMask to use this app.");
        }
    };

    const dismiss = () => setNetworkError("");

    // Optional: Check if the account changes (e.g., user switches account in MetaMask)
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setNetworkError("");
            } else {
                setNetworkError("Please connect to MetaMask.");
            }
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // Cleanup the event listener on component unmount
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, []);

    return (
        <div>
            <h1>My DApp</h1>
            <ConnectWallet 
                connectWallet={connectWallet} 
                networkError={networkError} 
                dismiss={dismiss} 
            />
            {account && <p>Connected account: {account}</p>}
            {/* Other components */}
        </div>
    );
}

export default App;
