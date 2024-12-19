import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  selectbutton: {
    border: "1px solid gold",
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Montserrat",
  },
});

const SelectButton = ({ children, selected, onClick }) => {
  const classes = useStyles(); // Add this line to get the classes

  return (
    <span onClick={onClick} className={classes.selectbutton}>
      {children}
    </span>
  );
};

export default SelectButton;
