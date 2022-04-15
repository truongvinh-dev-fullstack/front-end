import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";

class ModalIdea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      topicName: "",
      topicId: "",
      startdate: "",
      firstdate: "",
      finaldate: "",

      formData: "",
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topic !== this.props.topic) {
      let topic = this.props.topic;
      if (topic && !_.isEmpty(topic)) {
        this.setState({
          topicId: topic.id,
          topicName: topic.topic_name,
          startdate: topic.start_date,
          firstdate: topic.first_closure_date,
          finaldate: topic.final_closure_date,
        });
      }
    }
  }

  toggle = () => {
    this.setState({
      name: "",
      topicName: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    });
    this.props.toggleModal();
  };

  handleOnChangeInput = (e, id) => {
    let copystate = { ...this.state };
    copystate[id] = e.target.value;
    this.setState({
      ...copystate,
    });
  };

  checkValideInput = () => {
    let isValide = false;

    let { name, description, formData } = this.state;
    if (!name || !description || !formData) {
      alert("Missing parameter ");
    } else {
      isValide = true;
    }
    return isValide;
  };

  handleAddNewIdea = () => {
    let check = this.checkValideInput();
    if (check) {
      let { name, description, topicId, formData } = this.state;
      formData.append("name", name);
      formData.append("description", description);
      formData.append("topicId", topicId);
      formData.append("userId", this.props.userId);
      this.setState({
        formData: formData,
      });
      this.props.createNewIdea(formData);
      console.log("Done");
      this.props.toggleModal();
    }
  };

  handleOnChangeFile = (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    this.setState({
      formData: formData,
    });
  };

  render() {
    console.log("Check state model: ", this.state);
    return (
      <div>
        <Modal
          isOpen={this.props.isOpenModalIdea}
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
              <div className="col-12">
                <span>
                  <b>Start date:</b>
                </span>
                <span style={{ marginLeft: "40%" }}>
                  <b>End date:</b>
                </span>
              </div>
              <div className="input-container">
                <label>Idea Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "name");
                  }}
                  value={this.state.name}
                />
              </div>
              <div className="input-container">
                <label>Topic Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "topic");
                  }}
                  value={this.props.topic.topic_name}
                  disabled
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
                <label>Document</label>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    this.handleOnChangeFile(e);
                  }}
                  style={{ border: "none" }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleAddNewIdea();
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalIdea);
