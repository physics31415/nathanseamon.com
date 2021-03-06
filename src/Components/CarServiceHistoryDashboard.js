import React, {Component} from 'react'
import {Button, Card, Container, Col, Jumbotron, Row} from 'react-bootstrap'

import axios from 'axios'
import Popup from "reactjs-popup";

import {AddCarForm, AddEntryForm} from './Forms.js'
import CustomNavbar from './CustomNavbar.js'
import Login from './Login.js'
import '../App.css'
import delete_icon from '../icons/delete_icon.png' 


const CarServiceAPIHost = process.env.REACT_APP_CAR_SERVICE_HISTORY_APP

export default class ServiceHistoryDashboard extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      myCars: [],
      selected: null
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.thisOnSelect = this.thisOnSelect.bind(this);
    this.handleNewEntry = this.handleNewEntry.bind(this);
    this.handleNewCar = this.handleNewCar.bind(this);
    this.deleteCar = this.deleteCar.bind(this);
    this.deleteEntry= this.deleteEntry.bind(this);
  }
 
  componentDidMount() {
    this.setState({"selected": false});

    if (localStorage.getItem('token')) {
      axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
      axios.get((CarServiceAPIHost + "cars")).then((response) => {
        this.setState({ 'myCars': response.data});
      }).catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.reload(true);
        } else {
          alert("There was an error getting your cars");
        }
      });
    }
  };

  deleteEntry = (id) => {
    axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    axios.delete((CarServiceAPIHost + "service?id=" + id)
    ).then((response) => {
      const newEntries = this.state.entries.filter(entry => entry.record_id !== id);
      this.setState({ "entries": []});
      this.setState({ "entries": newEntries});
    }).catch((error) => {
      if (error && error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.reload(true);
      } else {
        alert("There was an error deleting your entry");
      }
    });
  }

  updateEntries = (id) => {
    axios.get((CarServiceAPIHost + "service?id=" + id)).then((response) => {
      this.setState({ 'entries': []});
      this.setState({ 'entries': response.data});
    }).catch((error) => {
      if (error && error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.reload(true);
      } else {
        alert("There was an error getting your service records");
      }
    });
  }

  deleteCar = (id) => {
    axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    axios.delete((CarServiceAPIHost + "cars?id=" + id)
    ).then((response) => {
      const cars = this.state.myCars.filter(car => car.id !== id);
      this.setState({ myCars: cars });
      if ( id === this.state.id) {
        this.resetSelected();
      }
    }).catch((error) => {
      if (error && error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.reload(true);
      } else {
        alert("There was an error deleting your car");
      }
    });
  }

  handleLogout = (e) => {
    localStorage.clear();
    window.location.reload(true);
  }

  handleNewEntry = (ent) => {
    this.updateEntries(this.state.id);
  }

  handleNewCar = (car) => {
    window.location.reload(true);
  }

  resetSelected = () => {
    this.setState({"selected": false});
    this.setState({"entries": []});
    this.setState({"make": ""});
    this.setState({"model": ""});
    this.setState({"trim": ""});
    this.setState({"year": ""});
    this.setState({"id": ""});
  }
  thisOnSelect = (car) => {
    this.setState({"selected": true});
    this.setState({"entries": []});

    axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    this.setState({"make": car.make});
    this.setState({"model": car.model});
    this.setState({"trim": car.trim});
    this.setState({"year": car.year});
    this.setState({"id": car.id});

    this.updateEntries(car.id);
  }

  render() {
    if (localStorage.getItem('token')) {
      const historyEntries = this.state.entries
        .sort((a, b) => (b.mileage - a.mileage))
        .map((entry) => (
        <Entry
          car_id={entry.car_id}
          service={entry.service}
          mileage={entry.mileage}
          date={entry.date}
          entry_id={entry.record_id}
          delete={this.deleteEntry}
          updateEntries={this.updateEntries}
        />
      ));
      
      const garageEntries = this.state.myCars.map((entry) => (
        <Car
          id={entry.id}
          make={entry.make}
          model={entry.model}
          trim={entry.trim}
          year={entry.year}
          thisOnSelect={this.thisOnSelect}
          delete={this.deleteCar}
          selected={entry.id === this.state.id ? "primary" : ""}
        />
      ));
      
      const Modal = () => (
        <Popup
          trigger={<Button variant="dark"> Add Car</Button>} modal closeOnDocumentClick>
          <div>
            <AddCarForm
            handleNewCar={this.handleNewCar}
            />
          </div>
        </Popup>
      );

      const Modal2 = () => (
        <Popup
          trigger={<Button variant="dark"> Add Service Entry</Button>} modal closeOnDocumentClick>
          <div>
            <AddEntryForm
            id={this.state.id}
            handleNewEntry={this.handleNewEntry}
            />
          </div>
        </Popup>
      );

      return (
        <div align="center">
          <CustomNavbar></CustomNavbar>
          <div class="add-space-large"/>
          <Container fluid={true}>
            <Row>
              <Col/>
              <Col>  
                <h1><b>Service History Dashboard</b></h1>
              </Col>
              <Col>
                <div align="right">
                  <Button variant="dark" onClick={() => {this.handleLogout()}}>Logout</Button>
                </div>
              </Col>
            </Row>
          </Container>
          <Jumbotron style={{ width: '97.5vw'}}>
            <Container fluid={true}>
              <Row>
                <Col>
                  <div class="add-space-top">
                    <h2><b>Your Cars</b></h2>
                  </div>
                  <div class="add-space-top">
                    <div id='entries' class='Entry-list'>
                      {garageEntries}
                      <ul> 
                        <Modal/>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col/>
                <Col class="centered">  {this.state.selected && 
                  <div>
                    <div> 
                      <h2> <b>Service History</b></h2>
                      <h3>{this.state.make} {this.state.model} {this.state.year}</h3>
                    </div>
                    <div id='entries' class='Entry-list'>
                      {historyEntries}
                      <ul>             
                        <Modal2 id={this.state.id}/>
                      </ul>
                    </div>
                  </div>}
                </Col>
              </Row>
            </Container>
          </Jumbotron>
        </div>
      );
    }  else {
      return (
        <div align="center">
          <CustomNavbar></CustomNavbar>
          <Login></Login>
        </div>
      );
    }
  };
}


class Entry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dateError: '',
      edit: false
    };
  }

  componentDidMount = () => {
    this.setState({'mileage': this.props.mileage, 'date': this.props.date, 'service': this.props.service});
    this.setState({'originalMileage': this.props.mileage, 'originalDate': this.props.date, 'originalService': this.props.service});
  };

  delete = () => {
    if(window.confirm("Are you sure you want to delete this entry?" )){
      this.props.delete(this.props.entry_id);
    }
  };

  editToggle = (clear=false) => {
    var edit = !this.state.edit;
    this.setState({'edit': edit});
    this.reset();
  };

  changeOriginals = () => {
    this.setState({'originalMileage': this.state.mileage, 'originalDate': this.state.date,
    'originalService': this.state.service});
  };

  reset = () => {
    this.setState({'mileage': this.state.originalMileage, 'date': this.state.originalDate,
    'service': this.state.originalService});
  };

  isDisabled = () => {
    if (this.state.mileage === "" || this.state.date === ""|| this.state.service === "" 
       || this.state.dateError !== "") {
      return true;
    } 
    if (this.state.originalMileage === parseInt(this.state.mileage) && this.state.originalDate === this.state.date
       && this.state.originalService === this.state.service) {
        return true;
    } 

    return false;
  };

  handleDateChange = (e) => {
    const validDate = RegExp(/(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])-(19|20)\d\d$/);
    if (validDate.test(e.target.value)){
      this.setState({'date': e.target.value});
      this.setState({'dateError': ""});
    } else {
      this.setState({'date': e.target.value});
      this.setState({'dateError': "Date must be in format MM-DD-YYYY"});
    }
  };

  handleServiceChange = (e) => {
    this.setState({'service': e.target.value});
  };

  handleMileageChange = (e) => {
    if(isNaN(e.target.value) || e.target.value < 0 ){
      e.target.value = this.state.mileage;
    } else {
      this.setState({'mileage': e.target.value});
    }
  };
  
  submit = () => {
    localStorage.getItem('token')
    axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    axios.put((CarServiceAPIHost + "service"), {
      'id': this.props.entry_id,
      'date': this.state.date,
      'mileage': this.state.mileage,
      'service': this.state.service
      
      }).then((response) => {
        this.setState({"edit": false});
        this.changeOriginals();
      }).catch((error) => {
        if (error && error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.reload(true);
        } else {
          alert("Your request was invalid");
        }
      }
    );
  }

  render() {
    if (this.state.edit) {
      return (
        <ul>
          <Card style={{ width: '40vw'}}  align="left" border="primary">
            <Card.Header>
              Edit Date:<br/> <input style={{width: "15vw"}} value={this.state.date} onChange={this.handleDateChange}/>
                <div><font color="red">{this.state.dateError}</font></div>
            </Card.Header> 
            <Card.Body padding-left="0px">    
              <Card.Text padding-left="15px">
                Edit Mileage: <br/><input style={{width: "15vw"}} value={this.state.mileage} onChange={this.handleMileageChange}/> 
              </Card.Text>
              <Card.Text>
                Edit Service: <br/><textarea style={{width: "20vw", height: "15vh"}} value={this.state.service}
                 onChange={this.handleServiceChange}/>
              </Card.Text>
              <div align="right">
              <Button variant="dark"  onClick={() => {this.submit()}} disabled={this.isDisabled()}>Save</Button>
                  <div class="divider"/>
                <Button variant="dark" onClick={() => {this.editToggle()}}>Cancel</Button>
              </div>
            </Card.Body>
          </Card>
        </ul>
      )
    } else {
      return (
        <ul>
          <Card style={{ width: '40vw'}}  align="left">
              <Card.Header>
                {this.state.date}
              </Card.Header> 
              <Card.Body padding-left="0px">    
                <Card.Title>
                  {this.state.mileage} miles
                </Card.Title>
                <Card.Text padding-left="15px">
                  {this.state.service}
                </Card.Text>
                <div align="right">
                  <Button variant="dark" onClick={(clear=false) => {this.editToggle()}}>Edit</Button>
                  <div class="divider"/>
                  <Button variant="danger" style={{"padding": "0px", "border": "0px"}} 
                          onClick={() => {this.delete()}}>
                      <img src={delete_icon} alt="delete" width="32" height="38"/>
                  </Button>
                </div>
            </Card.Body>
          </Card>
        </ul>
      )
    }
  };
}


class Car extends Component {

  select = () => {
    this.props.thisOnSelect(this.props);
  }

  delete = () => {
    if(window.confirm("Are you sure you want to delete: " + this.props.make + 
    " " + this.props.model + " " + this.props.year + "?")){
      this.props.delete(this.props.id);
    }
  };

  render() {
    return (
      <ul>
        <Card style={{ width: '30vw'}}  align="left" border={this.props.selected}>
            <Card.Header>
              {this.props.year}
            </Card.Header> 
            <Card.Body>    
              <Card.Title>
                {this.props.make}  {this.props.model} {this.props.trim}
              </Card.Title>
            <div align="right">
              <div>
                <Button variant="dark" onClick={() => {this.select()}}>Select</Button>
                <div class="divider"/>
                <Button variant="danger" style={{"padding": "0px", "border": "0px"}} onClick={() => {this.delete()}}>
                  <img src={delete_icon} alt="delete" width="32" height="38"/>
                </Button>
              </div>
            </div>    
          </Card.Body>
        </Card>
      </ul>
    )
  };
}
