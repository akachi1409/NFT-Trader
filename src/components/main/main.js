import { Component } from "react";
import { Row, Col, Modal, Form, Spinner } from "react-bootstrap";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
// import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import WAValidator from "wallet-address-validator";

import "./main.css";
import "react-calendar/dist/Calendar.css";
import { getDataForContract } from "../../util/util";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    borderWidth: "2px",
    borderColor: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    // justfyContent:center
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.common.black,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectModal: false,
      constractAdd: "",
      calendarAdd: new Date(),
      actionAdd: 1,
      selectData: [],
      resultData: [],
      changeFlag: false,
      loading: false,
    };
  }
  notify = (msg) => toast(msg);
  showSelectModal = () => {
    this.setState({ selectModal: true });
  };
  hideSelectModal = () => {
    this.setState({ selectModal: false });
  };
  setContractAdd = (e) => {
    this.setState({ constractAdd: e.target.value });
  };

  getData = () => {
    const { selectData } = this.state;
    if (selectData.length === 0) {
      this.notify("You should choose at least one collection to search!");
      return;
    }
    for (var i = 0; i < selectData.length; i++) {
      console.log("k:", selectData[i].contract);
    }
  };
  test = async () => {
    const { selectData, changeFlag } = this.state;
    this.setState({ loading: true });
    if (selectData.length === 0) {
      this.notify("You should choose at least one collection to search!");
      this.setState({ loading: false });
      return;
    }

    var tempResult = [];
    for (const item of selectData) {
      console.log(
        "----------------------------------------------------------------",
        tempResult
      );
      const data = [];
      const dateTimestamp = item.calendar.getTime();
      const date = new Date(dateTimestamp);
      var temp = await getDataForContract(item.contract, date, item.actionAdd);
      for (let i = 0; i < temp.length; i++) {
        // console.log(temp[i]);
        if (data.includes(temp[i])) continue;
        data.push(temp[i]);
      }
      console.log("data: " + data, data.length);
      var temp = [];
      if (tempResult.length == 0) {
        tempResult = tempResult.concat(data);
      } else {
        for (let i = 0; i < tempResult.length; i++) {
          // for ( let j = 0 ; j< data.length; j++){
          //   // console.log(tempResult[i] , data[j])
          //   if ( tempResult[i] == data[j]){
          //     console.log(tempResult[i] , data[j])
          //     temp.push(tempResult[i]);
          //   }
          // }
          if (data.includes(tempResult[i])) {
            temp.push(tempResult[i]);
          }
        }
        tempResult = [];
        tempResult = tempResult.concat(temp);
      }
      console.log("tempData:", tempResult);
    }
    console.log("resultData:", tempResult);
    this.setState({
      resultData: tempResult,
      changeFlag: !changeFlag,
      loading: false,
    });
  };
  addData = () => {
    const { constractAdd, selectData, calendarAdd, actionAdd } = this.state;
    // console.log(this.state);
    if (!WAValidator.validate(constractAdd, "ETH")) {
      this.notify("You should input valid wallet address.");
      return;
    }
    const addData = {
      contract: constractAdd,
      calendar: calendarAdd,
      actionAdd: actionAdd,
    };
    // console.log("addData:", addData);
    selectData.push(addData);
    this.setState({ constractAdd: "" });
    this.setState({ selectData: selectData });
    this.setState({ actionAdd: "1" });
  };
  saveChanges = () => {
    this.addData();
    this.hideSelectModal();
  };
  cancelChanges = () => {
    this.setState({ constractAdd: "" });
    this.hideSelectModal();
  };

  getFormattedDate(date) {
    var str =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return str;
  }

  render() {
    const {
      selectModal,
      contractAdd,
      selectData,
      resultData,
      calendarAdd,
      actionAdd,
      loading,
    } = this.state;
    return (
      <>
        {/* <Container> */}
        <Paper elevation={5} className="main-paper">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {loading && (
                <Row>
                  {/* <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button> */}
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="success"
                    >
                      Loading
                    </LoadingButton>
                  </Col>
                  <Col xs={2}></Col>
                </Row>
              )}

              <Row>
                <Col sm={4}></Col>
                <Col sm={8}>
                  <Button
                    variant="contained"
                    color="success"
                    className="general-btn"
                    onClick={() => this.showSelectModal()}
                  >
                    Select
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="general-btn"
                    onClick={() => this.test()}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
              <Row className="genearl-mt-2">
                <Col sm={2}></Col>
                <Col sm={8}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell className="main-table-header">
                            #
                          </StyledTableCell>
                          <StyledTableCell>Contract Address</StyledTableCell>
                          <StyledTableCell>End Date</StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectData.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index}</StyledTableCell>
                            <StyledTableCell>{item.contract}</StyledTableCell>
                            <StyledTableCell>
                              {this.getFormattedDate(item.calendar)}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.actionAdd == "1" && "Buy"}
                              {item.actionAdd == "2" && "Sell"}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Col>
                <Col sm={2}></Col>
              </Row>
              <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                  <TableContainer component={Paper} className="genearl-mt-2">
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell className="main-table-header">
                            #
                          </StyledTableCell>
                          <StyledTableCell>Wallet Address</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {resultData.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index}</StyledTableCell>
                            <StyledTableCell>{item}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Col>
                <Col sm={2}></Col>
              </Row>
              <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                  <Copyright sx={{ pt: 4 }} />
                </Col>
              </Row>
              <ToastContainer />
              <Modal
                show={selectModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header>
                  <Modal.Title>
                    <Typography variant="h5" component="h6">
                      Add contract address to search!
                    </Typography>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    <Col sm={4}>
                      <Typography variant="h5" component="h6">
                        Contract:
                      </Typography>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="lg"
                        type="text"
                        placeholder="Type the contract address here"
                        value={contractAdd}
                        onChange={(e) => this.setContractAdd(e)}
                      />
                    </Col>
                  </Row>
                  <Row className="genearl-mt-2">
                    <Col sm={4}>
                      <Typography variant="h5" component="h6">
                        Calendar:
                      </Typography>
                    </Col>
                    <Col sm={8}>
                      <Calendar
                        value={calendarAdd}
                        onChange={(value) =>
                          this.setState({ calendarAdd: value })
                        }
                      ></Calendar>
                    </Col>
                  </Row>
                  <Row className="genearl-mt-2">
                    <Col sm={4}>
                      <Typography variant="h5" component="h6">
                        Action:
                      </Typography>
                    </Col>
                    <Col sm={8}>
                      <Form.Select
                        aria-label=""
                        value={actionAdd}
                        onChange={(e) =>
                          this.setState({ actionAdd: e.target.value })
                        }
                      >
                        <option value="1">Buy</option>
                        <option value="2">Sell</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="contained"
                    color="success"
                    className="general-btn"
                    onClick={() => this.cancelChanges()}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="general-btn"
                    onClick={() => this.saveChanges()}
                  >
                    Save changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Grid>

            {/* <Grid item xs={1}></Grid> */}
          </Grid>
        </Paper>
        {/* </Container> */}
      </>
    );
  }
}
export default Main;
