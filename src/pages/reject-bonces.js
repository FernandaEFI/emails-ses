import React, { useState, useEffect } from 'react';

import moment from 'moment';
import Router from 'next/router';
import { useSnackbar } from 'notistack';

import { DatePicker } from 'antd';

import { Button, Divider, TextField, Typography } from '@material-ui/core/';

import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import agGridLocaleTextES from '../I18n/agGrid.es';

import { useSession, signIn } from 'next-auth/client';

import Header from './components/header';
import Footer from './components/footer';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minHeight: 'calc(90vh)',
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.h4.fontSize,
      textAlign: 'center',
    },
  },
  divider: { margin: theme.spacing(2, 0, 3, 0) },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  search: {
    marginLeft: 'auto',
    width: '300px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  table: {
    marginTop: theme.spacing(3),
    height: 600,
    width: '100%',
  },
}));

export default function RejectBounces() {
  const [dates, setDates] = useState(['', '']);

  const { RangePicker } = DatePicker;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [session, loading] = useSession();

  useEffect(() => {
    console.log({ dates });
    fetch(`/api/reject-bonces?startDate=${dates[0]}&endDate=${dates[1]}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setRowData(json);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dates]);

  if (loading) {
    return null;
  }

  if (loading) {
    return null;
  }
  const rowClassRules = {
    'atendido-color': function (params) {
      return params.data.status === 'atendido';
    },
  };

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  }

  function fullDateGetter(params) {
    return params.data.date + '  ' + params.data.hour;
  }

  function onBtExport() {
    gridApi.exportDataAsExcel({ fileName: 'Correos_Rebotados.xlsx' });
  }

  const onSearch = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  var filterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = moment(cellValue).format('YYYY-MM-DD');
      console.log('dateAsString', dateAsString);
      var dateParts = dateAsString.split('-');
      const day = Number(dateParts[2]);
      const month = Number(dateParts[1]) - 1;
      const year = Number(dateParts[0]);
      const cellDate = new Date(year, month, day);
      console.log('datecell', cellDate);

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
  };

  const changeStatusAtendido = () => {
    var selectedRows = gridApi.getSelectedRows();
    selectedRows.forEach((row) => {
      if (row.status == 'pendiente') {
        UpdateItem(row, 'atendido');
      }
    });
  };

  const changeStatusPendiente = () => {
    var selectedRows = gridApi.getSelectedRows();
    selectedRows.forEach((row) => {
      if (row.status == 'atendido') {
        UpdateItem(row, 'pendiente');
      }
    });
  };

  function UpdateItem(row, statusEmail) {
    const { id } = row;
    const { date } = row;
    const status = statusEmail;

    fetch('/api/reject-bonces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, date, status }),
    })
      .then((response) => response.json())
      .then(({ error }) => {
        if (error) {
          console.error(error);
          enqueueSnackbar(`${error}`, {
            variant: 'error',
            persist: true,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        } else {
          console.log('Status actualizado');
          var rowNode = gridApi.getRowNode(id);
          rowNode.setDataValue('status', status);
          enqueueSnackbar('Estatus actulizado', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        }
      })
      .catch((error) => {
        console.error(error.message);
        enqueueSnackbar(`${error.message}`, {
          variant: 'error',
          persist: true,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      });
  }

  if (session) {
    return (
      <>
        <Header />

        <div className={classes.root}>
          <Typography gutterBottom variant="h3" className={classes.title}>
            Correos Rebotados
          </Typography>
          <Divider variant="middle" className={classes.divider} />

          <div className={classes.actions}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<DoneIcon />}
              onClick={() => changeStatusAtendido()}
            >
              Atendido
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<IndeterminateCheckBoxIcon />}
              onClick={() => changeStatusPendiente()}
            >
              Pendiente
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DescriptionIcon />}
              style={{ backgroundColor: '#00b347', color: 'white' }}
              className={classes.button}
              onClick={onBtExport}
            >
              Exportar Excel
            </Button>

            <RangePicker
              onChange={(value, dateString) => {
                setDates(dateString);
              }}
            />
            <TextField
              placeholder="Buscar..."
              className={classes.search}
              onChange={onSearch}
            />
          </div>
          <div className={`ag-theme-alpine ${classes.table}`}>
            {rowData.length > 0 ? (
              <AgGridReact
                localeText={agGridLocaleTextES}
                onGridReady={onGridReady}
                rowData={rowData}
                resizable={true}
                pagination={true}
                paginationPageSize={10}
                debounceVerticalScrollbar={true}
                defaultColDef={{ sortable: true, resizable: true }}
                suppressRowClickSelection={true}
                rowSelection={'multiple'}
                rowClassRules={rowClassRules}
                getRowNodeId={function (data) {
                  return data.id;
                }}
              >
                <AgGridColumn
                  headerName="ID"
                  field="id"
                  width={150}
                  headerCheckboxSelection={true}
                  headerCheckboxSelectionFilteredOnly={true}
                  checkboxSelection={true}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Estatus"
                  field="status"
                  width={100}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Tipo"
                  field="messageType"
                  width={100}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Asunto"
                  field="subject"
                  width={350}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="De"
                  field="from"
                  flex={1}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Para"
                  field="to"
                  flex={1}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Destinos"
                  field="destinos"
                  flex={1}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Fecha"
                  field="date&hour"
                  filter="agDateColumnFilter"
                  valueGetter={fullDateGetter}
                  width={200}
                  sort={'desc'}
                  filterParams={filterParams}
                  floatingFilter={true}
                ></AgGridColumn>
              </AgGridReact>
            ) : (
              'no hay registros'
            )}
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return Router.push('/');
}
