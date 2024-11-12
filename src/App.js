//* /////////////////////////////////////////////FIRST DESIGN/////////////////////////////////////////////////////////

/*
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

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
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

  // Simulated wallet connection
  const connectWallet = async () => {
    setLoading(true);
    try {
      // Simulate wallet connection with a random address
      const mockAddress =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("");
      setWalletAddress(mockAddress);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const simulateTransaction = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    return true;
  };

  const initiateService = async () => {
    if (!serviceDetails || !parts.some((part) => part)) return;
    const success = await simulateTransaction();
    if (success) {
      setServiceDetails("");
      setParts(["", "", "", "", ""]);
    }
    return success;
  };

  const registerServiceCenter = async () => {
    if (!serviceCenterAddress || !serviceCenterAddress.startsWith("0x")) {
      throw new Error("Please enter a valid address.");
    }
    const success = await simulateTransaction();
    if (success) {
      setServiceCenterAddress("");
    }
    return success;
  };

  const verifyRecord = async () => {
    if (!recordId || !signature) return;
    const success = await simulateTransaction();
    if (success) {
      setVerificationStatus((prev) => ({ ...prev, brandVerified: true }));
    }
    return success;
  };

  const verifyParts = async () => {
    if (!recordId || !signature) return;
    const success = await simulateTransaction();
    if (success) {
      setVerificationStatus((prev) => ({ ...prev, partsVerified: true }));
    }
    return success;
  };

  const verifyByUser = async () => {
    if (!recordId || !signature) return;
    const success = await simulateTransaction();
    if (success) {
      setVerificationStatus((prev) => ({ ...prev, userVerified: true }));
    }
    return success;
  };

  const progressPercentage =
    Object.values(verificationStatus).filter(Boolean).length * (100 / 3);

  return (
    <div className="min-h-screen bg-gray-50">
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
        <section className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Verification Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`flex items-center space-x-2 ${
                    verificationStatus.brandVerified
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Brand Verified</span>
                </div>
                <div
                  className={`flex items-center space-x-2 ${
                    verificationStatus.partsVerified
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Parts Verified</span>
                </div>
                <div
                  className={`flex items-center space-x-2 ${
                    verificationStatus.userVerified
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>User Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Service Center Registration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Initiate Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

        <section className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle>Verification Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Brand Verification</h3>
                  <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Record ID"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Signature"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  <h3 className="font-semibold">Parts Verification</h3>
                  <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Record ID"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Signature"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={verifyParts}
                    disabled={loading}
                  >
                    Verify Parts
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">User Verification</h3>
                  <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Record ID"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Signature"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

*/

//* ///////////////////////////////////////////SECOND DESIGN/////////////////////////////////////////////////////////

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
        {/* <section className="col-span-full">
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Verification Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`flex items-center space-x-2 ${
                    verificationStatus.brandVerified
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-gray-300">Brand Verified</span>
                </div>
                <div
                  className={`flex items-center space-x-2 ${
                    verificationStatus.partsVerified
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-gray-300">Parts Verified</span>
                </div>
                <div
                  className={`flex items-center space-x-2 ${
                    verificationStatus.userVerified
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-gray-300">User Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section> */}

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

        <section className="col-span-full">
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle>Verification Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
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
                    placeholder="Signature"
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

//* ///////////////////////////////////////////////Another Design///////////////////////////////////////////

/*
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

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");
  const [parts, setParts] = useState(["", "", "", "", ""]);
  const [recordId, setRecordId] = useState("");
  const [signature, setSignature] = useState("");
  const [serviceCenterAddress, setServiceCenterAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    brandVerified: false,
    partsVerified: false,
    userVerified: false,
  });

  // Keeping the same functionality as provided in the original code
  const connectWallet = async () => {
    setLoading(true);
    try {
      const mockAddress =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("");
      setWalletAddress(mockAddress);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const simulateTransaction = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    return true;
  };

  // Keeping other functions the same as in original code
  const initiateService = async () => {
    if (!serviceDetails || !parts.some((part) => part)) return;
    const success = await simulateTransaction();
    if (success) {
      setServiceDetails("");
      setParts(["", "", "", "", ""]);
    }
    return success;
  };

  const registerServiceCenter = async () => {
    if (!serviceCenterAddress || !serviceCenterAddress.startsWith("0x")) {
      throw new Error("Please enter a valid address.");
    }
    const success = await simulateTransaction();
    if (success) {
      setServiceCenterAddress("");
    }
    return success;
  };

  const verifyRecord = async () => {
    if (!recordId || !signature) return;
    const success = await simulateTransaction();
    if (success) {
      setVerificationStatus((prev) => ({ ...prev, brandVerified: true }));
    }
    return success;
  };

  const verifyParts = async () => {
    if (!recordId || !signature) return;
    const success = await simulateTransaction();
    if (success) {
      setVerificationStatus((prev) => ({ ...prev, partsVerified: true }));
    }
    return success;
  };

  const verifyByUser = async () => {
    if (!recordId || !signature) return;
    const success = await simulateTransaction();
    if (success) {
      setVerificationStatus((prev) => ({ ...prev, userVerified: true }));
    }
    return success;
  };

  const progressPercentage =
    Object.values(verificationStatus).filter(Boolean).length * (100 / 3);

  const glassmorphicCard =
    "bg-opacity-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-xl";
  const inputStyle =
    "w-full px-4 py-2 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-white placeholder-gray-400";
  const buttonStyle =
    "w-full py-2 px-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <header className="bg-black bg-opacity-20 backdrop-blur-md p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car size={32} className="text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Vehicle Service Record DApp
              </h1>
            </div>
            {walletAddress ? (
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
                <UserCircle size={20} className="text-blue-400" />
                <span className="font-medium">{`${walletAddress.slice(
                  0,
                  6
                )}...${walletAddress.slice(-4)}`}</span>
              </div>
            ) : (
              <button
                className={`${buttonStyle} bg-blue-500 hover:bg-blue-600 text-white font-medium`}
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
        <Alert className="max-w-7xl mx-auto mt-4 bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Processing transaction... Please wait.
          </AlertDescription>
        </Alert>
      )}

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="col-span-full">
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-300">
                <ShieldCheck className="h-5 w-5" />
                <span>Verification Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-700/50 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(verificationStatus).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center space-x-2 ${
                      value ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-300">
                <Building className="h-5 w-5" />
                <span>Service Center Registration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="text"
                  value={serviceCenterAddress}
                  onChange={(e) => setServiceCenterAddress(e.target.value)}
                  placeholder="Service Center Address (0x...)"
                  className={inputStyle}
                />
                <button
                  className={`${buttonStyle} bg-blue-500 hover:bg-blue-600`}
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
              <CardTitle className="flex items-center space-x-2 text-blue-300">
                <Wrench className="h-5 w-5" />
                <span>Initiate Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="text"
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  placeholder="Service Details"
                  className={inputStyle}
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
                      className={inputStyle}
                    />
                  ))}
                </div>
                <button
                  className={`${buttonStyle} bg-blue-500 hover:bg-blue-600`}
                  onClick={initiateService}
                  disabled={loading}
                >
                  Initiate Service
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="col-span-full">
          <Card className={glassmorphicCard}>
            <CardHeader>
              <CardTitle className="text-blue-300">
                Verification Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Brand Verification",
                    action: verifyRecord,
                    color: "yellow",
                  },
                  {
                    title: "Parts Verification",
                    action: verifyParts,
                    color: "green",
                  },
                  {
                    title: "User Verification",
                    action: verifyByUser,
                    color: "red",
                  },
                ].map((section) => (
                  <div key={section.title} className="space-y-4">
                    <h3 className="font-semibold text-blue-300">
                      {section.title}
                    </h3>
                    <input
                      type="number"
                      value={recordId}
                      onChange={(e) => setRecordId(e.target.value)}
                      placeholder="Record ID"
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Signature"
                      className={inputStyle}
                    />
                    <button
                      className={`${buttonStyle} bg-${section.color}-500 hover:bg-${section.color}-600`}
                      onClick={section.action}
                      disabled={loading}
                    >
                      {`Verify ${section.title.split(" ")[0]}`}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

*/
