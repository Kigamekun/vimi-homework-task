import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import Search from 'antd/lib/input/Search'
import { Select } from 'antd';
import data from './db.json'
import type { ISolve } from './interfaces/ISolve'
import type { DataType } from './interfaces/DataType'
import './App.css';


const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    render: (_, { name }) => <b>{name}</b>,
  },
  {
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
    render: (_, { type }) => <b>{type}</b>,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => <b>{status}</b>,
  },
  // {
  //   title: 'Archived',
  //   key: 'archived',
  //   dataIndex: 'archived',
  //   render: (_, { archived }) => <>{archived ? 'TRU' : 'FALS'}</>,
  // },
  {
    title: 'Created',
    key: 'createdOn',
    dataIndex: 'createdOn',
    render: (_, { createdOn }) => <>{new Date(createdOn).toLocaleDateString('en', {
      month: "short",
      day: "2-digit",
      year: "numeric"
    })}</>,
  },
  {
    title: 'Manage',
    render: (_) => <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg></>
  },
];


const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  // console.log('params', pagination, filters, sorter, extra);
};




const App: React.FC = () => {

  const [datas, setData] = useState<DataType[]>([]);
  const [query, setQuery] = useState<ISolve>({ name: '', state_status: '', status: '', type: '', state_type: '', after: '', archived: '' })
  const [sortBy, setSortBy] = useState<string>("")
  const [search, setSearch] = useState<string>("")


  const searchData = (e: React.ChangeEvent<HTMLInputElement>) => {
    var qry = e.target.value;
    var type = ['educational', 'testimonial', 'training', 'recreational'];
    var status = ['INCOMPLETE', 'SHOOTING', 'EDITING', 'FEEDBACK', 'COMPLETED'];
    var solve = { name: '', ss: '', status: '', type: '', st: '', after: '', archived: '' }
    let qr = qry.split(' ')
    let nm = ''
    // console.log(qr);
    let i = 0
    if (qr.length >= 1) {
      qr.forEach((element: string) => {
        var qw = element.split(':')
        if (qw.length > 1) {
          if (qw[0] === 'is') {
            if (type.includes(qw[1]?.toLowerCase())) {
              solve.type = qw[1]?.toLowerCase();
              solve.st = '1';
            }
            if (status.includes(qw[1]?.toUpperCase())) {
              solve.status = qw[1]?.toUpperCase();
              solve.ss = '1';
            }
            if (qw[1] === 'archived') {
              solve.archived = '1';
            }
          }
          if (qw[0] === 'not') {
            let name = qw[1]?.toLowerCase()
            if (type.includes(name)) {
              solve.type = name;
              solve.st = '0';
            }
            if (status.includes(name)) {
              solve.status = name;
              solve.ss = '0';
            }
            if (qw[1] === 'archived') {
              solve.archived = '0';
            }
          }
          if (qw[0] === 'after') {
            solve.after = qw[1];
          }
        } else {
          nm += element + ' ';
        }
      });
      solve.name = nm.trim();
    }
    // console.log(solve);
    setQuery({
      name: solve.name,
      state_status: solve.ss,
      status: solve.status,
      type: solve.type,
      state_type: solve.st,
      after: solve.after,
      archived: solve.archived,
    })
    setSearch(qry)
  }


  var dataSort = datas.sort((objA, objB) => {
    return sortBy === 'ASC' ? new Date(objA.createdOn).getTime() - new Date(objB.createdOn).getTime() : new Date(objB.createdOn).getTime() - new Date(objA.createdOn).getTime()
  })


  var dataSearch = dataSort.filter((el) => {
    if (search !== '') {
      let sl = 0;
      if (query.state_status !== '') {
        if (query.state_status === "1" && el.status === query.status) {
          sl += 1;
        }
        if (query.state_status === "0" && el.status !== query.status) {
          sl += 1;
        }
      } else {
        sl += 1;
      }
      if (query.state_type !== '') {
        if (query.state_type === "1" && el.type === query.type) {
          sl += 1
        }
        if (query.state_type === "0" && el.type !== query.type) {
          sl += 1;
        }
      } else {
        sl += 1;
      }
      if (query.archived !== '') {
        if (query.archived === "0" && el.archived === false) {
          sl += 1;
        }
        if (query.archived === "1" && el.archived === true) {
          sl += 1;
        }
      } else {
        sl += 1;
      }
      if (query.after !== '') {
        if (new Date(el.createdOn).getTime() >= new Date(query.after).getTime()) {
          sl += 1;
        }
      } else {
        sl += 1;
      }
      if (sl === 4 && el.name.toLowerCase().includes(query.name.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true
    }
  })

  const sortData = (e: string) => {
    setSortBy(e)
  }

  useEffect(() => {
    return setData(data);
  }, [])

  return (
    <>
      <h1 style={{ marginLeft: '10%' }}>Hello Gerard.</h1>
      <p style={{ marginLeft: '10%' }}>Here are the list of projects you submitted.</p>

      <br />
      <div className="flex-container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Recent Projects</h3>
          <div>
            <Search style={{ width: '400px' }} onChange={searchData}></Search>
            <Select
              defaultValue="Sort By"
              style={{ width: 120 }}
              onChange={sortData}
              options={[
                {
                  value: '',
                  label: 'Sort By Date',
                },
                {
                  value: 'ASC',
                  label: 'ASC',
                },
                {
                  value: 'DESC',
                  label: 'DESC',
                },
              ]}
            />
          </div>
        </div>
        <Table columns={columns} dataSource={dataSearch} onChange={onChange} />
      </div>

    </>
  )
};

export default App;