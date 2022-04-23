import { Component } from "react";
import { Container, Row, Col, Button, Modal, Form, Table } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import "./main.css";
import { getDataForContract } from "../../util/util";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectModal: false,
      constractAdd: "",
      selectData:[]
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
    this.setState({constractAdd: e.target.value});
  };

  getData = ()=>{
      const { selectData } = this.state
      if (selectData.length ==0){
          this.notify("You should choose at least one collection to search!")
          return;
      }
      for (var i = 0 ; i<selectData.length; i++){
        console.log("k:", selectData[i].contract)
      }
    //   getDataForContract(constractAdd).then(response=>{
    //     if (response.status === 400 || response.status === 500)
    //     throw response.data;

    //     const data = response.asset_events;
    //     console.log("data: " + data)
    //   });
  }
  addData = () =>{
      const { constractAdd, selectData } = this.state;
      const addData = {'contract': constractAdd}
      selectData.push(addData);
      this.setState({constractAdd: ""})
      this.setState({selectData: selectData});
  }
  saveChanges = () =>{
      this.addData();
      this.hideSelectModal();
  }
  cancelChanges = () =>{
      this.setState({constractAdd: ""})
      this.hideSelectModal();
  }
  render() {
    const { selectModal, contractAdd, selectData } = this.state;
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
              <Button variant="info" size="lg" className="general-btn" onClick = {()=>this.getData()}>
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
                    {
                        selectData.map((item, index) => (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{item.contract}</td>
                            </tr>
                        ))
                    }
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
                    onChange = {(e)=>this.setContractAdd(e)}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick = {()=> this.cancelChanges()}>Cancel</Button>
              <Button variant="primary" onClick = {()=> this.saveChanges()}>Save changes</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
}
export default Main;
