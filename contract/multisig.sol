// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleServiceRecord {

    struct ServiceRecord {
        address customer;
        address serviceCenter;
        string serviceDetails;
        string[5] parts;              // Array of part serial numbers
        bool verifiedByBrand;
        bool verifiedByUser;
        bool completed;
        bytes brandSignature;
        bytes customerSignature;
    }

    address public brand;
    mapping(address => bool) public serviceCenters;
    mapping(uint256 => ServiceRecord) public records;
    uint256 public recordCount;

    event ServiceCenterRegistered(address serviceCenter);
    event ServiceCenterRemoved(address serviceCenter);
    event ServiceRecorded(uint256 indexed recordId, address customer, address serviceCenter);
    event BrandVerified(uint256 indexed recordId);
    event UserVerified(uint256 indexed recordId);

    modifier onlyBrand() {
        require(msg.sender == brand, "Only brand can perform this action");
        _;
    }

    modifier onlyServiceCenter() {
        require(serviceCenters[msg.sender], "Only registered service centers can perform this action");
        _;
    }

    constructor() {
        brand = msg.sender;
    }

    function registerServiceCenter(address _serviceCenter) external onlyBrand {
        serviceCenters[_serviceCenter] = true;
        emit ServiceCenterRegistered(_serviceCenter);
    }

    function removeServiceCenter(address _serviceCenter) external onlyBrand {
        serviceCenters[_serviceCenter] = false;
        emit ServiceCenterRemoved(_serviceCenter);
    }

    /// @notice Initiates a service record by a service center
    /// @param _customer Address of the customer receiving the service
    /// @param _serviceDetails Details of the service
    /// @param _parts Array of up to 5 part serial numbers
    function initiateService(address _customer, string calldata _serviceDetails, string[5] calldata _parts) external onlyServiceCenter {
        records[recordCount] = ServiceRecord({
            customer: _customer,
            serviceCenter: msg.sender,
            serviceDetails: _serviceDetails,
            parts: _parts,
            verifiedByBrand: false,
            verifiedByUser: false,
            completed: false,
            brandSignature: "",
            customerSignature: ""
        });

        emit ServiceRecorded(recordCount, _customer, msg.sender);
        recordCount++;
    }

    function verifyByBrand(uint256 _recordId, bytes calldata _signature) external onlyBrand {
        ServiceRecord storage record = records[_recordId];
        require(!record.verifiedByBrand, "Already verified by brand");

        record.verifiedByBrand = true;
        record.brandSignature = _signature;

        emit BrandVerified(_recordId);
    }

    function verifyByUser(uint256 _recordId, bytes calldata _signature) external {
        ServiceRecord storage record = records[_recordId];
        require(msg.sender == record.customer, "Only customer can verify");
        require(record.verifiedByBrand, "Brand verification required first");

        record.verifiedByUser = true;
        record.customerSignature = _signature;
        record.completed = true;

        emit UserVerified(_recordId);
    }

    /// @notice Retrieves all unverified service records by the customer or brand
    /// @return unverifiedRecordIds Array of IDs of unverified service records
    function getUnverifiedRecords() external view returns (uint256[] memory) {
        uint256[] memory unverifiedRecordIds = new uint256[](recordCount);
        uint256 counter = 0;

        for (uint256 i = 0; i < recordCount; i++) {
            ServiceRecord storage record = records[i];
            if (!record.completed) {
                unverifiedRecordIds[counter] = i;
                counter++;
            }
        }

        // Resize the array to the actual number of unverified records
        assembly { mstore(unverifiedRecordIds, counter) }
        return unverifiedRecordIds;
    }

    /// @notice Verifies if a given part ID is part of the recorded service parts for a specific record ID
    /// @param _recordId ID of the service record
    /// @param _partId Serial number of the part to verify
    /// @return bool True if the part is in the parts array for the record, false otherwise
    function verifyPartsAuthenticity(uint256 _recordId, string calldata _partId) external view returns (bool) {
        ServiceRecord storage record = records[_recordId];
        bytes32 partHash = keccak256(abi.encodePacked(_partId));

        for (uint256 i = 0; i < record.parts.length; i++) {
            if (keccak256(abi.encodePacked(record.parts[i])) == partHash) {
                return true; // Part ID is found in the parts array
            }
        }
        return false; // Part ID is not found
    }
}
