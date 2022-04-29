/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	//"encoding/json"
	"fmt"
	//"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	//"github.com/hyperledger/fabric-chaincode-go"
)

// SmartContract provides functions for managing a car
type SmartContract struct {
	contractapi.Contract
}

func (s *SmartContract) Invoke(ctx contractapi.TransactionContextInterface,chaincodeName string , email string) (string) {
	pbResponse := ctx.GetStub().InvokeChaincode(chaincodeName, [][]byte{[]byte("queryPatient"), []byte(email) }, "mychannel");

	// if err != nil{
	// 	fmt.Printf("Error :" + err);
	// 	return err;	
	// }
	
	return string(pbResponse.Payload);
}


func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}


	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}

	
}
