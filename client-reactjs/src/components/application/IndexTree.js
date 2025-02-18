import {Treant} from 'treant-js/Treant.js';
//import 'treant-js/vendor/raphael.min.js';
import { Table, Divider, message, Popconfirm, Icon, Tooltip } from 'antd/lib';
import React, { Component } from "react";
import IndexDetailsForm from "./IndexDetails";
import { authHeader, handleError } from "../common/AuthHeader.js"

class IndexTree extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    applications: [],
    openFileDetailsDialog: false,
    selectedFile: "",
    applicationId: this.props.applicationId,
    indexes: []

  }

 componentDidMount() {
    this.fetchDataAndRenderTable();
  }

  componentWillReceiveProps(props) {
    this.setState({
        applicationId: props.applicationId
      });
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      setTimeout(() => {
        this.fetchDataAndRenderTable();
      }, 200);

    }
  }

  fetchDataAndRenderTable() {
    var _self=this;
    fetch("/api/index/read/index_list?app_id="+this.state.applicationId, {
      headers: authHeader()
    })
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      handleError(response);
    })
    .then(data => {
      this.setState({
        indexes: data
      });
    }).catch(error => {
      console.log(error);
    });
    //this._setupListeners();
  }

  handleEdit(fileId) {
    this.setState({
      openFileDetailsDialog: true,
      selectedFile: fileId
    });
    //this.child.showModal();
  }

  handleDelete(indexId) {
    console.log(indexId);
    var data = JSON.stringify({indexId: indexId, application_id: this.state.applicationId});
    fetch("/api/index/read/delete", {
      method: 'post',
      headers: authHeader(),
      body: data
    }).then((response) => {
      if(response.ok) {
        return response.json();
      }
      handleError(response);
    })
    .then(result => {
      this.fetchDataAndRenderTable();
      message.success("Index deleted sucessfully");
    }).catch(error => {
      console.log(error);
      message.error("There was an error deleting the Index file");
    });
  }

  handleClose = () => {
    console.log('handleClose')
    this.setState({
      openFileDetailsDialog: false
    });
  }

  handleRefreshTree = () => this.fetchDataAndRenderTable();

  render() {
    const indexColumns = [{
      title: 'Name',
      dataIndex: 'title',
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '30%',
    },
    {
      width: '30%',
      title: 'Source File',
      dataIndex: 'file.title'
    },
    {
      width: '30%',
      title: 'Action',
      dataIndex: '',
      render: (text, record) =>
        <span>
          <a href="#" onClick={(row) => this.handleEdit(record.id)}><Tooltip placement="right" title={"Edit Index"}><Icon type="edit" /></Tooltip></a>
          <Divider type="vertical" />
          <Popconfirm title="Are you sure you want to delete this Index?" onConfirm={() => this.handleDelete(record.id)} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
            <a href="#"><Tooltip placement="right" title={"Delete Index"}><Icon type="delete" /></Tooltip></a>
          </Popconfirm>
        </span>
    }];
    return (
      <div>
        <Table
            columns={indexColumns}
            rowKey={record => record.id}
            dataSource={this.state.indexes}
            pagination={{ pageSize: 10 }} scroll={{ y: 460 }}
          />
        {this.state.openFileDetailsDialog ?
          <IndexDetailsForm
            onRef={ref => (this.child = ref)}
            selectedIndex={this.state.selectedFile}
            applicationId={this.props.applicationId}
            onRefresh={this.handleRefreshTree}
            onClose={this.handleClose}/> : null}
      </div>
    )
  }
}

export default IndexTree;