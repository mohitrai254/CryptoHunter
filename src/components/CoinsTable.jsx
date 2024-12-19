import { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import { CoinList } from "../config/api";
import axios from "axios";
import {
  Container,
  createTheme,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "./Banner/Carousel";

// Define custom styles
const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
}));

function CoinsTable() {
  const [coins, setCoins] = useState([]); // Holds coins data
  const [loading, setLoading] = useState(false); // Manages loading state
  const [search, setSearch] = useState(""); // Manages search term
  const [page, setPage] = useState(1); // Pagination page state

  const { currency, symbol } = CryptoState(); // Access currency and symbol from context
  const classes = useStyles(); // Use custom styles
  const navigate = useNavigate(); // React Router hook for navigation

  // Function to fetch coins data
  const fetchCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch coins data based on currency and pagination
  useEffect(() => {
    fetchCoins();
  }, [currency]);

  // Function to handle coin search (for filtering)
  const handleSearch = () => {
    if (!search) return coins; // Return all coins if no search term
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Define dark theme for the application
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  // Get filtered and paginated display of coins
  const filteredCoins = handleSearch();
  const displayCoins = filteredCoins.slice((page - 1) * 10, page * 10);

  return (
    // Wrap the component with ThemeProvider to pass the theme
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>

        {/* Search bar for filtering coins */}
        <TextField
          label="Search for a Cryptocurrency..."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)} // Update search query
        />

        {/* Display coins table */}
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      key={head}
                      align={head === "Coin" ? "left" : "right"}
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {displayCoins.map((row) => {
                  const profit = row.price_change_percentage_24h > 0; // Detect price change direction (profit/loss)
                  return (
                    <TableRow
                      onClick={() => navigate(`/coins/${row.id}`)}
                      className={classes.row}
                      key={row.id}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ display: "flex", gap: 15 }}
                      >
                        <img
                          src={row?.image} // Optional chaining
                          alt={row.name}
                          height="50"
                          style={{ marginBottom: 10 }}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              textTransform: "uppercase",
                              fontSize: 22,
                            }}
                          >
                            {row.symbol}
                          </span>
                          <span style={{ color: "darkgrey" }}>{row.name}</span>
                        </div>
                      </TableCell>

                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(row.current_price.toFixed(2))}
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{
                          color: profit ? "rgb(14, 203, 129)" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {profit && "+"}
                        {row.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>

                      <TableCell align="right">
                        {symbol}{" "}
                        {numberWithCommas(
                          row.market_cap.toString().slice(0, -6)
                        )}
                        M
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(filteredCoins.length / 10)}
          className={classes.pagination}
          onChange={(_, value) => {
            setPage(value);
            window.scrollTo(0, 450); // Scroll to top after page change
          }}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Container>
    </ThemeProvider>
  );
}

export default CoinsTable;
