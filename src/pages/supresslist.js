import React, { useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { makeStyles } from '@material-ui/core/styles';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
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
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  emailInput: {
    width: '100%',
  },
  reasonSelect: {
    width: '100%',
  },
  button: {
    fontSize: '1em',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8em',
    },
  },
}));

const REASONS = ['BOUNCE', 'COMPLAINT'];
const REGIONS = ['us-east-2', 'us-east-1'];

export default function Supresslist() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [region, setRegion] = useState(REGIONS[0]);
  const [reason, setReason] = useState(REASONS[0]);

  useEffect(() => {
    fetch(`/api/supresslist?region=${region}`)
      .then((response) => response.json())
      .then(({ data }) => {
        setRowData(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [region]);
  if (loading) {
    return null;
  }

  const onGridReady = ({ api }) => {
    setGridApi(api);
    //api.sizeColumnsToFit();
  };

  const onSearch = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const onRemoveSelected = () => {
    var selectedRows = gridApi.getSelectedRows();
    selectedRows.forEach((row) => {
      removeEmail(row);
    });
  };

  function removeEmail(row) {
    const { email } = row;

    fetch('/api/supresslist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, region }),
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
          console.log('Correo electronico elmininado.');
          gridApi.applyTransaction({ remove: [row] });
          enqueueSnackbar('Correo electronico elmininado.', {
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  const addEmail = () => {
    if (!email || !reason) {
      console.error(
        `Favor de indicar el correo electronico y la razon de bloqueo.`
      );
    } else {
      closeDialog();
      fetch('/api/supresslist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason, region }),
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
            console.log('Correo electronico agregado.');
            gridApi.applyTransaction({ add: [{ email, reason }] });
            enqueueSnackbar('Correo electronico agregado.', {
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
  };

  if (session) {
    return (
      <>
        <Header />
        <div className={classes.root}>
          <Typography gutterBottom variant="h3" className={classes.title}>
            Lista de supresión
          </Typography>
          <Divider variant="middle" className={classes.divider} />

          <div className={classes.actions}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<DeleteIcon />}
              onClick={onRemoveSelected}
            >
              Borrar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={openDialog}
            >
              Agregar
            </Button>
            <FormControl className={classes.formControl}>
              <InputLabel shrink>Domino</InputLabel>
              <Select
                displayEmpty
                value={region}
                onChange={handleRegionChange}
                className={classes.reasonSelect}
              >
                <MenuItem key={REGIONS[0]} value={REGIONS[0]}>
                  efinfo.mx (ohio)
                </MenuItem>
                <MenuItem key={REGIONS[1]} value={REGIONS[1]}>
                  efinte.com (virginia)
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              placeholder="Buscar..."
              className={classes.search}
              onChange={onSearch}
            />
          </div>
          <div className={`ag-theme-alpine ${classes.table}`}>
            <AgGridReact
              localeText={agGridLocaleTextES}
              onGridReady={onGridReady}
              rowData={rowData}
              resizable={true}
              pagination={true}
              paginationPageSize={10}
              debounceVerticalScrollbar={true}
              rowSelection={'multiple'}
              animateRows={false}
              defaultColDef={{ sortable: true }}
              domLayout={'autoHeight'}
            >
              <AgGridColumn
                headerName="Correo electrónico"
                field="email"
                sort={'asc'}
                flex={1}
                headerCheckboxSelection={true}
                headerCheckboxSelectionFilteredOnly={true}
                checkboxSelection={true}
              ></AgGridColumn>
              <AgGridColumn
                headerName="Razón"
                field="reason"
                width={120}
              ></AgGridColumn>
            </AgGridReact>
          </div>
        </div>
        <Dialog open={open} onClose={closeDialog}>
          <DialogTitle>Agregar correo electronico</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <FormControl className={classes.formControl}>
              <TextField
                placeholder="ejemplo@correo.com"
                className={classes.emailInput}
                onChange={handleEmailChange}
                label={'Email'}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel shrink>Razón</InputLabel>
              <Select
                displayEmpty
                value={reason}
                onChange={handleReasonChange}
                className={classes.reasonSelect}
              >
                {REASONS.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogContentText color="secondary">
              El correo agregado ya no recibira correos desde efinfo.mx
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={addEmail} color="primary" autoFocus>
              Si, continuar
            </Button>
            <Button onClick={closeDialog} color="secondary">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
        <Footer />
      </>
    );
  }
  return Router.push('/');
}
