import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { connectWallet } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "./../../redux/data/dataActions";
import { StyledRoundButton } from "./../../components/styles/styledRoundButton.styled";
import * as s from "./../../styles/globalStyles";
import Navbar from "../../components/Navbar/Navbar";
import Countdown from "../../components/Countdown/Countdown";
import axios from 'axios';

const { createAlchemyWeb3, ethers } = require("@alch/alchemy-web3");

var Web3 = require('web3');
var Contract = require('web3-eth-contract');

function Home() {
  let cost = 0;
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const [supply, setTotalSupply] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mintAmount, setMintAmount] = useState(1);
  const [displayCost, setDisplayCost] = useState(cost);
  const [show, setShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [canMint, setCanMint] = useState(-1);
  const [pushArr , setPushArr] = useState([]);
  let proof = [];
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = displayCost;
    cost = Web3.utils.toWei(cost);

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}`);
    setClaimingNft(true);
    setDisable(true);
    console.log(pushArr);
    blockchain.smartContract.methods
      .mint(pushArr,mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setMintDone(true);
        setFeedback(`Congratulations! You have successfully Minted a VCR NFT!`);
        setClaimingNft(false);
        blockchain.smartContract.methods
          .totalSupply()
          .call()
          .then((res) => {
            setTotalSupply(res);
          });

        dispatch(fetchData(blockchain.account));
      });
  };


  const getDataWithoutWallet = async() => {
    const web3 = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/oq76jy5CfS2gZWtW8QD9v0RzqsVF86GZ");

    const blockNumber = await web3.eth.getBlockNumber();
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    var contract = new Contract(abi, '0x142cfb7288e198e064c87016347197e0faba4d6e');
    contract.setProvider(web3.currentProvider);
    // console.log(blockNumber);
    const salesConfig = await contract.methods.saleConfig().call();
    setDisplayCost(Web3.utils.fromWei(salesConfig.mintlistPrice));
    // console.log(salesConfig.publicSaleStartTime);
    let blockDiff = blockNumber - salesConfig.publicSaleStartTime;

    // multiply blockdiff by 3 sec and you will get the time in seconds
    if(salesConfig.publicSaleStartTime >= blockDiff){
      setShow(true);
      var timestamp = salesConfig.publicSaleStartTime
      var date = new Date(timestamp);
      // console.log(date.getTime())
      // console.log(date);
      // console.log(show);
    }

    }

  const getData = async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      await axios.get(`https://vipcardroom.com/api/whitelist/key?address=${blockchain.account}`)
      .then(res => {
        console.log(res.data.data.proof);
        if(res.data.code === 0){
          setCanMint(0);
        }else{
          let result = res.data.data.proof;
          console.log(result);
          proof = result;
          setPushArr(proof);
          setCanMint(1);
          console.log({pushArr});
          console.log({canMint});
        }
      });
      const totalSupply = await blockchain.smartContract.methods
        .totalSupply()
        .call();
      setTotalSupply(totalSupply);
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
    getDataWithoutWallet();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  let countDownDate = new Date("Mar 18, 2022 20:00:00 GMT -5:00").getTime();

  let now = new Date().getTime();

  let timeleft = countDownDate - now;

  const [days, setDays] = useState();
  const [hours, setHour] = useState();
  const [minutes, setMint] = useState();
  const [seconds, setSec] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setDays(Math.floor(timeleft / (1000 * 60 * 60 * 24)));
      setHour(
        Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMint(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)));
      setSec(Math.floor((timeleft % (1000 * 60)) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [days, hours, minutes, seconds]);

  return (
    <>

      <s.Body>
        {/* <Navbar /> */}

        {days > -1 && hours > -1 && minutes > -1 && seconds > -1 && (
          <Countdown />

        )}
        <s.FlexContainer
          jc={"space-evenly"}
          ai={"center"}
          fd={"row"}
          mt={"20vh"}
        >
          <s.Mint>
            <s.TextTitle size={2.0}>
              VipCardRoom WhiteList Minting Now
            </s.TextTitle>
            <s.TextTitle size={2.0}>
              etherscan.io
            </s.TextTitle>
            <s.SpacerSmall />
           
            <s.SpacerLarge />

            <s.FlexContainer fd={"column"} ai={"center"} jc={"center"}>
              <div>
                <s.TextTitle>Price: {displayCost}</s.TextTitle>
              </div>
              <div>
              <s.TextTitle size={1.5}> Excluding Gas Fee</s.TextTitle>

              </div>
            </s.FlexContainer>


            <s.SpacerSmall />
            <s.SpacerLarge />

            {blockchain.account !== "" && blockchain.smartContract !== null && blockchain.errorMsg === ""
            && canMint === 1
            ? (
              <s.Container ai={"center"} jc={"center"} fd={"column"}>
                <s.connectButton
                  disabled={disable}
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight:"bolder"
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    claimNFTs();
                    getData();
                  }}
                >
                  {" "}
                  {claimingNft ? "Confirm Transaction in Wallet" : "Mint Now"}{" "}
                
                
                </s.connectButton>{" "}
               <s.SpacerLarge></s.SpacerLarge>
                <s.TextTitle size={"1.5"}>
                {mintDone ? feedback : ""}{" "}

                </s.TextTitle>
              </s.Container>
            ) : (
              <>
                <s.connectButton
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight:"bolder"
                  }}
                  
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(connectWallet());
                    getData();
                  }}
                >
                  {canMint === -1 ? "Connect Your Wallet" : "This Wallet is not whitelisted"}
                </s.connectButton>
                {/* ) : ("")} */}
              </>

            )}
            <s.SpacerLarge />
            {blockchain.errorMsg !== "" ? (
              <s.connectButton
                style={{
                  textAlign: "center",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {blockchain.errorMsg}
              </s.connectButton>
            ) : (
              ""

            )}

           
          </s.Mint>
        </s.FlexContainer>
        <s.SpacerLarge />
      </s.Body>

    </>
  );
}

export default Home;
