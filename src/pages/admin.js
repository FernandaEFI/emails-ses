import React, { useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

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

import { useSession, signIn, signOut } from 'next-auth/client';

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
  ROLelect: {
    width: '100%',
  },
  button: {
    fontSize: '1em',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8em',
    },
  },
}));

const ROL = ['OPERACIONES', 'ADMINISTRADOR'];

export default function Supresslist() {
  const classes = useStyles();
  //const [session, loading] = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(ROL[0]);
  var [idUser, rowDelete] = useState('');

  const [session, loading] = useSession();
  const [rolUser, setRolUser] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setRowData(json);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

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
  const openDialogEdit = () => {
    setOpenEdit(true);
  };
  const closeDialogEdit = () => {
    setOpenEdit(false);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRolChange = (event) => {
    setRol(event.target.value);
  };

  const addUser = () => {
    if (!name || !nickname || !email || !password || !rol) {
      console.error(`Favor de ingresar todos los datos.`);
    } else {
      closeDialog();
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nickname, email, password, rol }),
      })
        .then((response) => response.json())
        .then(({ error, dataUser }) => {
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
            for (var data of dataUser) {
              var id = data.id;
              var status = data.status;
            }
            gridApi.applyTransaction({
              add: [{ id, name, nickname, email, rol, status }],
            });
            enqueueSnackbar('Usuario agregado.', {
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
  const editUserDialog = () => {
    openDialogEdit();
  };

  const editUser = () => {
    var selectedRows = gridApi.getSelectedRows();

    selectedRows.forEach((row) => {
      idUser = row.id;
      console.log(row.id);
    });
    for (var c of selectedRows) {
      idUser = c.id;
    }
    closeDialogEdit();

    fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUser, rol }),
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
          var rowNode = gridApi.getRowNode(idUser);
          rowNode.setDataValue('rol', rol);
          enqueueSnackbar('Usuario actualizado', {
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
  };

  const deleteUser = () => {
    var selectedRows = gridApi.getSelectedRows();

    selectedRows.forEach((row) => {
      rowDelete = row;
      idUser = row.id;
    });
    fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUser }),
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
          gridApi.applyTransaction({ remove: [rowDelete] });
          enqueueSnackbar('Usuario borrado', {
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
  };
  const rolSession = (user) => {
    fetch('/api/userSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    })
      .then((response) => response.json())
      .then(({ error, rol }) => {
        if (error) {
          console.error(error);
        } else {
          // console.log('Sesion',rol);
          setRolUser(rol);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  if (session) {
    var user = session.user.name;
    const rol = rolSession(user);
    if (rolUser == 'ADMINISTRADOR') {
      return (
        <>
          <Header />
          <div className={classes.root}>
            <Typography gutterBottom variant="h3" className={classes.title}>
              Usuarios
            </Typography>
            <Divider variant="middle" className={classes.divider} />

            <div className={classes.actions}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<AddIcon />}
                onClick={openDialog}
              >
                Agregar
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={editUserDialog}
              >
                Editar
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                className={classes.button}
                onClick={deleteUser}
              >
                Eliminar
              </Button>
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
                defaultColDef={{ sortable: true, resizable: true }}
                suppressRowClickSelection={true}
                getRowNodeId={function (data) {
                  return data.id;
                }}
              >
                <AgGridColumn
                  headerName="Nombre"
                  field="name"
                  headerCheckboxSelection={false}
                  headerCheckboxSelectionFilteredOnly={false}
                  checkboxSelection={true}
                  flex={3}
                ></AgGridColumn>

                <AgGridColumn
                  headerName="Correo"
                  field="email"
                  flex={3}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Nombre de usuario"
                  field="nickname"
                  flex={1.5}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Rol"
                  field="rol"
                  flex={1.5}
                ></AgGridColumn>
                <AgGridColumn
                  headerName="Estatus"
                  field="status"
                  flex={1}
                ></AgGridColumn>
              </AgGridReact>
            </div>
          </div>
          <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>Agregar usuario</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <FormControl className={classes.formControl}>
                <TextField
                  placeholder="nombre completo"
                  className={classes.emailInput}
                  onChange={handleNameChange}
                  label={'Nombre'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  placeholder="user123"
                  className={classes.emailInput}
                  onChange={handleNicknameChange}
                  label={'Nombre de usuario '}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
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
                <TextField
                  placeholder=""
                  className={classes.emailInput}
                  onChange={handlePasswordChange}
                  type="password"
                  label={'password'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel shrink>Rol usuario</InputLabel>
                <Select
                  displayEmpty
                  value={rol}
                  onChange={handleRolChange}
                  className={classes.ROLelect}
                >
                  {ROL.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={addUser} color="primary" autoFocus>
                Si, continuar
              </Button>
              <Button onClick={closeDialog} color="secondary">
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openEdit} onClose={closeDialogEdit}>
            <DialogTitle>Editar rol usuario</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <FormControl className={classes.formControl}>
                <InputLabel shrink>Rol usuario</InputLabel>
                <Select
                  displayEmpty
                  value={rol}
                  onChange={handleRolChange}
                  className={classes.ROLelect}
                >
                  {ROL.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={editUser} color="primary" autoFocus>
                Si, continuar
              </Button>
              <Button onClick={closeDialogEdit} color="secondary">
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
          <Footer />
        </>
      );
    } else {
      return (
        <>
          <Header />
          <div className={classes.root}>
            <Typography gutterBottom variant="h3" className={classes.title}>
              Lo sentimos no tienes permisos sufucientes
            </Typography>
            <Divider variant="middle" className={classes.divider} />
          </div>

          <Footer />
        </>
      );
    }
  }
  return <> {signIn()}</>;
}
