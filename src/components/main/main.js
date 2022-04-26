import { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
  Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import WAValidator from "wallet-address-validator";

import "./main.css";
import "react-calendar/dist/Calendar.css";
import { getDataForContract } from "../../util/util";

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
    this.setState({loading: true});
    if (selectData.length === 0) {
      this.notify("You should choose at least one collection to search!");
      this.setState({loading: false});
      return;
    }

    var tempResult = [];
    for (const item of selectData) {
      console.log("----------------------------------------------------------------", tempResult);
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
        // for (let i = 0; i < data.length; i++) {
        //   tempResult.push(data[i]);
        // }
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
          if ( data.includes(tempResult[i]) ){
            temp.push(tempResult[i])
          }
        }
        tempResult = [];
        tempResult = tempResult.concat(temp);
      }
      console.log("tempData:", tempResult);
      
    }
    console.log("resultData:", tempResult);
    this.setState({ resultData: tempResult, changeFlag: !changeFlag, loading: false });
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
      loading
    } = this.state;
    return (
      <>
        <Container>
          {loading && (
            <Row>
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            </Row>
          )}

          <Row>
            <Col sm={4}></Col>
            <Col sm={8}>
              <Button
                variant="primary"
                size="lg"
                className="general-btn"
                onClick={() => this.showSelectModal()}
              >
                Select
              </Button>
              <Button
                variant="info"
                size="lg"
                className="general-btn"
                onClick={() => this.test()}
              >
                Search
              </Button>
            </Col>
          </Row>
          <Row className="genearl-mt-2">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Contract Address</th>
                  <th>End Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectData.map((item, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item.contract}</td>
                    <td>{this.getFormattedDate(item.calendar)}</td>
                    <td>
                      {item.actionAdd == "1" && "Buy"}
                      {item.actionAdd == "2" && "Sell"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Wallet Address</th>
                </tr>
              </thead>
              <tbody>
                {resultData.map((item, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
          <ToastContainer />
          <Modal show={selectModal}>
            <Modal.Header>
              <Modal.Title>Add contract address to search!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={4}>
                  <h3>Contract:</h3>
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
              <Row>
                <Col sm={4}>
                  <h3>Calendar:</h3>
                </Col>
                <Col sm={8}>
                  <Calendar
                    value={calendarAdd}
                    onChange={(value) => this.setState({ calendarAdd: value })}
                  ></Calendar>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <h3>Action:</h3>
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
              <Button variant="secondary" onClick={() => this.cancelChanges()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => this.saveChanges()}>
                Save changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
}
export default Main;
