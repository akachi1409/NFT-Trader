import { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import WAValidator from 'wallet-address-validator';

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
      selectData: [],
      resultData: [],
      changeFlag: false,
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
    if (selectData.length == 0) {
      this.notify("You should choose at least one collection to search!");
      return;
    }
    for (var i = 0; i < selectData.length; i++) {
      console.log("k:", selectData[i].contract);
    }
  };
  test = async () => {
    const { selectData, resultData, changeFlag } = this.state;
    if (selectData.length == 0) {
      this.notify("You should choose at least one collection to search!");
      return;
    }
    const data = [];
    var tempResult = [];
    for (const item of selectData) {
      for (var index = 0; index < 90; index++) {
        const dateTimestamp = item.calendar.getTime() - 3 * 24 * 60 * 60 * 1000;
        const date = new Date(dateTimestamp);
        var temp = await getDataForContract(item.contract, date);
        for (var i = 0; i < temp.length; i++) {
          console.log(temp[i], typeof temp[i]);
          if (data.includes(temp[i])) continue;
          data.push(temp[i]);
        }
        if (tempResult.length == 0) {
          for (var i = 0; i < data.length; i++) {
            tempResult.push(data[i]);
          }
        } else {
          for (var i = 0; i < tempResult.length; i++) {
            if (!data.includes(tempResult[i])) {
              tempResult = tempResult.filter((x) => x !== tempResult[i]);
            }
          }
        }
      }
      console.log("data: " + data, typeof data, data.length);
    }
    console.log("resultData:", tempResult);
    this.setState({ resultData: tempResult, changeFlag: !changeFlag });
  };
  addData = () => {
    const { constractAdd, selectData, calendarAdd } = this.state;

    if (!WAValidator.validate(constractAdd, "ETH")){
      this.notify("You should input valid wallet address.");
      return;
    }
    const addData = { contract: constractAdd, calendar: calendarAdd };
    selectData.push(addData);
    this.setState({ constractAdd: "" });
    this.setState({ selectData: selectData });
  };
  saveChanges = () => {
    this.addData();
    this.hideSelectModal();
  };
  cancelChanges = () => {
    this.setState({ constractAdd: "" });
    this.hideSelectModal();
  };
  render() {
    const { selectModal, contractAdd, selectData, resultData, calendarAdd } =
      this.state;
    return (
      <>
        <Container>
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
                </tr>
              </thead>
              <tbody>
                {selectData.map((item, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item.contract}</td>
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
                  <th>Seller Wallet Address</th>
                  <th>Buyer Wallet Address</th>
                </tr>
              </thead>
              <tbody>
                {resultData.map((item, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item[0].from}</td>
                    <td>{item[0].to}</td>
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
