import { styled } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HtmlReactParser from "html-react-parser";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";

import { numberWithCommas } from "./Banner/Carousel";
import { LinearProgress, Typography } from "@mui/material";

// Styled components using MUI 5's styled API
const Container = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Sidebar = styled("div")(({ theme }) => ({
  width: "30%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 25,
  borderRight: "2px solid grey",
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: 20,
  fontFamily: "Montserrat",
}));

const Description = styled(Typography)(({ theme }) => ({
  width: "100%",
  fontFamily: "Montserrat",
  padding: 25,
  paddingBottom: 15,
  paddingTop: 0,
  textAlign: "justify",
}));

const MarketData = styled("div")(({ theme }) => ({
  alignSelf: "start",
  padding: 25,
  paddingTop: 10,
  width: "100%",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "space-around",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
  [theme.breakpoints.down("xs")]: {
    alignItems: "start",
  },
}));

const Coin = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const { currency, symbol } = CryptoState();

  // Fetching data
  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [currency, id]); // Adding `id` as a dependency to re-fetch when it changes

  // Loading state
  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <Container>
      <Sidebar>
        <img
          src={coin?.image?.large || ""}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Heading variant="h3">
          {coin?.name || "Coin name not available"}
        </Heading>
        <Description variant="subtitle1">
          {HtmlReactParser(
            coin?.description?.en?.split(". ")[0] || "Description not available"
          )}
        </Description>
        <MarketData>
          <span style={{ display: "flex" }}>
            <Typography variant="h5">
              Rank: {numberWithCommas(coin?.market_cap_rank) || "N/A"}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5">
              Current Price: {symbol}{" "}
              {numberWithCommas(
                coin?.market_data?.current_price?.[currency.toLowerCase()] || 0
              ) || "0"}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5">
              Market Cap: {symbol}{" "}
              {numberWithCommas(
                (coin?.market_data?.market_cap?.[currency.toLowerCase()] || 0)
                  .toString()
                  .slice(0, -6)
              ) || "0"}{" "}
              M
            </Typography>
          </span>
        </MarketData>
      </Sidebar>
      <CoinInfo coin={coin} />
    </Container>
  );
};

export default Coin;
