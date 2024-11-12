import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserCircle,
  Car,
  Building,
  Wrench,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import contractABI from "./contractABI.json";
import { ethers } from "ethers";
const contractAddress = "0xac0ee857926b09cd08158540915e06d1dbc73999";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [serviceDetails, setServiceDetails] = useState("");
  const [parts, setParts] = useState(["", "", "", "", ""]);
  const [recordId, setRecordId] = useState("");
  const [signature, setSignature] = useState("");
  const [serviceCenterAddress, setServiceCenterAddress] = useState("");
  const [unverifiedRecords, setUnverifiedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    brandVerified: false,
    partsVerified: false,
    userVerified: false,
  });

  const glassmorphicCard =
    "bg-opacity-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-xl";
  const inputStyle =
    "w-full px-4 py-2 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-white placeholder-gray-400";
  const buttonStyle =
    "w-full py-2 px-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]";
  // Simulated wallet connection
  const connectWallet = async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const address = await newSigner.getAddress();
        setWalletAddress(address);
        setProvider(newProvider);
        setSigner(newSigner);
        const newContract = new ethers.Contract(
          contractAddress,
          contractABI,
          newSigner
        );
        setContract(newContract);
        setLoading(false);
      } else {
        alert("MetaMask is required.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setLoading(false);
    }
  };

  const initiateService = async () => {
    if (!serviceDetails || !parts) return;
    setLoading(true);
    try {
      const tx = await contract.initiateService(
        walletAddress,
        serviceDetails,
        parts
      );
      await tx.wait();
      alert("Service initiated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error initiating service:", error);
      setLoading(false);
    }
  };

  const registerServiceCenter = async () => {
    if (
      !serviceCenterAddress ||
      !ethers.utils.isAddress(serviceCenterAddress)
    ) {
      alert("Please enter a valid Ethereum address.");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.registerServiceCenter(serviceCenterAddress);
      await tx.wait();
      alert("Service Center Registered!");
      setLoading(false);
    } catch (error) {
      console.error("Error registering service center:", error);
      setLoading(false);
    }
  };

  const verifyRecord = async () => {
    if (!recordId || !signature) return;
    setLoading(true);
    try {
      const tx = await contract.verifyByBrand(recordId, signature);
      await tx.wait();
      alert("Record verified by brand!");
      setLoading(false);
    } catch (error) {
      console.error("Error verifying record by brand:", error);
      setLoading(false);
    }
  };

  const verifyParts = async () => {
    if (!recordId || !signature) return;
    setLoading(true);
    try {
      // Call the function directly if it doesn't send a transaction
      const result = await contract.verifyPartsAuthenticity(
        recordId,
        signature
      );

      // Process the result (assuming result indicates success or failure)
      if (result) {
        alert("Parts verified for authenticity!");
      } else {
        alert("Verification failed or returned unexpected result.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error verifying parts authenticity:", error);
      setLoading(false);
    }
  };

  const verifyByUser = async () => {
    if (!recordId || !signature) return;
    setLoading(true);
    try {
      const tx = await contract.verifyByUser(recordId, signature);
      await tx.wait();
      alert("Record verified by user!");
      setLoading(false);
    } catch (error) {
      console.error("Error verifying record by user:", error);
      setLoading(false);
    }
  };

  const getRecord = async () => {
    if (!recordId || !contract) return;
    const record = await contract.records(recordId);
    console.log("Record Data: ", record);
  };

  const getUnverifiedRecords = async () => {
    setLoading(true);
    try {
      const unverifiedRecords = await contract.getUnverifiedRecords();
      setUnverifiedRecords(unverifiedRecords);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching unverified records:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum && !walletAddress) {
      connectWallet();
    }
  }, [walletAddress]);

  const progressPercentage =
    Object.values(verificationStatus).filter(Boolean).length * (100 / 3);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white"
      style={{
        backgroundAttachment: "fixed",
        backgroundImage: "url('/carImage.jpg')", // Assuming the image is in the public folder
        backgroundSize: "cover", // Ensures the image covers the whole background
        backgroundPosition: "center", // Centers the background image
      }}
    >
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car size={32} />
              <h1 className="text-3xl font-bold">
                Vehicle Service Record DApp
              </h1>
            </div>
            {walletAddress ? (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <UserCircle size={20} />
                <span className="font-medium">{`${walletAddress.slice(
                  0,
                  6
                )}...${walletAddress.slice(-4)}`}</span>
              </div>
            ) : (
              <button
                className="bg-white text-blue-600 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                onClick={connectWallet}
                disabled={loading}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {loading && (
        <Alert className="max-w-7xl mx-auto mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Processing transaction... Please wait.
          </AlertDescription>
        </Alert>
      )}

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unverified Records */}
        <Card className={glassmorphicCard}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Unsigned Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-green-300 text-lg">
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={getUnverifiedRecords}
              >
                Get Unverified Records
              </button>
              {unverifiedRecords.length > 0 ? (
                <ul className="space-y-2">
                  {unverifiedRecords.map((recordId, index) => (
                    <li key={index} className="text-center">
                      <span>Record ID: {recordId.toString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-lg text-blue-400">
                  No unverified records found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <section>
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Service Center Registration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <input
                  type="text"
                  value={serviceCenterAddress}
                  onChange={(e) => setServiceCenterAddress(e.target.value)}
                  placeholder="Service Center Address (0x...)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={registerServiceCenter}
                  disabled={loading}
                >
                  Register Service Center
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Initiate Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <input
                  type="text"
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  placeholder="Service Details"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <div className="space-y-2">
                  {parts.map((part, index) => (
                    <input
                      key={index}
                      type="text"
                      value={part}
                      onChange={(e) => {
                        const newParts = [...parts];
                        newParts[index] = e.target.value;
                        setParts(newParts);
                      }}
                      placeholder={`Part ${index + 1}`}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ))}
                </div>
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={initiateService}
                  disabled={loading}
                >
                  Initiate Service
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Verify Parts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold">Parts Verification</h3>
                <input
                  type="number"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  placeholder="Record ID"
                  className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Part ID"
                  className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={verifyParts}
                  disabled={loading}
                >
                  Verify Parts
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="col-span-full">
          <Card className={glassmorphicCard} y>
            <CardHeader>
              <CardTitle>Verification Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 ">
                  <h3 className="font-semibold">Brand Verification</h3>
                  <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Record ID"
                    className=" text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Signature"
                    className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                    onClick={verifyRecord}
                    disabled={loading}
                  >
                    Verify by Brand
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">User Verification</h3>
                  <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Record ID"
                    className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Signature"
                    className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    onClick={verifyByUser}
                    disabled={loading}
                  >
                    Verify by User
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
