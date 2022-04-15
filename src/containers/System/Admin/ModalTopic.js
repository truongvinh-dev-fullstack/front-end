import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";

class ModalTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    };
  }

  componentDidMount() {
    let topic = this.props.editTopic;
    if (topic && !_.isEmpty(topic)) {
      this.setState({
        id: topic.id,
        name: topic.topic_name,
        description: topic.description,
        startdate: topic.start_date,
        firstdate: topic.first_closure_date,
        finaldate: topic.final_closure_date,
      });
    }

    console.log("check did mount: ", this.props.editUser);
  }

  toggle = () => {
    this.setState({
      id: "",
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    });
    this.props.toggleModalTopic();
  };

  handleOnChangeInput = (e, id) => {
    let copystate = { ...this.state };
    copystate[id] = e.target.value;
    this.setState({
      ...copystate,
    });
  };

  checkValideInput = () => {
    let isValide = true;
    let arrInput = [
      "name",
      "description",
      "startdate",
      "firstdate",
      "finaldate",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValide = false;
        alert("Missing parameter " + arrInput[i]);
        break;
      }
    }
    return isValide;
  };

  handleAddNewTopic = () => {
    let check = this.checkValideInput();
    if (check) {
      this.props.createNewTopic(this.state);
      console.log("Done");
    }
  };

  handleEditTopic = () => {
    let check = this.checkValideInput();
    if (check) {
      this.props.DoEditTopic(this.state);

      console.log("Done");
    }
  };

  render() {
    console.log("Check state model: ", this.state);
    return (
      <div>
        <Modal
          id="AddTopic"
          isOpen={this.props.isOpenAdd}
          toggle={() => {
            this.toggle();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          >
            Create New User
          </ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="input-container">
                <label>Topic Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "name");
                  }}
                  value={this.state.name}
                />
              </div>
              <div className="input-container">
                <label>Description</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "description");
                  }}
                  value={this.state.description}
                />
              </div>
              <div className="input-container">
                <label>Start date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "startdate");
                  }}
                  value={this.state.startdate}
                />
              </div>
              <div className="input-container">
                <label>First closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "firstdate");
                  }}
                  value={this.state.firstdate}
                />
              </div>
              <div className="input-container">
                <label>Final closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "finaldate");
                  }}
                  value={this.state.finaldate}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleAddNewTopic();
              }}
              className="px-3"
            >
              Save
            </Button>{" "}
            <Button
              onClick={() => {
                this.toggle();
              }}
              className="px-3"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          id="EditUser"
          isOpen={this.props.isOpenEdit}
          toggle={() => {
            this.toggle();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          ></ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="input-container">
                <label>Topic Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "name");
                  }}
                  value={this.state.name}
                />
              </div>
              <div className="input-container">
                <label>Description</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "description");
                  }}
                  value={this.state.description}
                />
              </div>
              <div className="input-container">
                <label>Start date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "startdate");
                  }}
                  value={this.state.startdate}
                />
              </div>
              <div className="input-container">
                <label>First closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "firstdate");
                  }}
                  value={this.state.firstdate}
                />
              </div>
              <div className="input-container">
                <label>Final closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "finaldate");
                  }}
                  value={this.state.finaldate}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleEditTopic();
              }}
              className="px-3"
            >
              Save Change
            </Button>{" "}
            <Button
              onClick={() => {
                this.toggle();
              }}
              className="px-3"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalTopic);
