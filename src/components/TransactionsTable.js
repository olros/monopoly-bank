import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import firebase from '../firebase';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const formatNumber = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

const formatTime = (t) => {
    var dt = new Date(t);
    let string = (dt.getMonth() + 1).toString().padStart(2, '0') + "." +
        dt.getDate().toString().padStart(2, '0') + "." +
        dt.getFullYear().toString().padStart(4, '0') + " " +
        dt.getHours().toString().padStart(2, '0') + ":" +
        dt.getMinutes().toString().padStart(2, '0') + ":" +
        dt.getSeconds().toString().padStart(2, '0');
    return string;
}

const columns = [
  { id: 'fromName', label: 'Fra' },
  { id: 'toName', label: 'Til' },
  {
    id: 'amount',
    label: 'Sum',
    align: 'right',
    format: (value) => formatNumber(value),
  },
  {
    id: 'time',
    label: 'Tid',
    align: 'right',
    format: (value) => formatTime(value),
  },
];

const useStyles = makeStyles({
    root: {
        maxWidth: 700,
        margin: 'auto',
        width: '100%',
        backgroundColor: 'var(--secondary-background)',
        padding: 20,
        marginBottom: 20,
    },
    table: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    subtitle: {
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: 10,
    },
    stickyHeader: {
        borderRadius: 4,
        overflow: 'hidden',
    },
});

function TransactionsTable(props) {
    const classes = useStyles();
    const { game } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const db = firebase.firestore();
        db.collection('games').doc(game.id).collection('transactions').onSnapshot((querySnapshot) => {
            let newRows = [];
            querySnapshot.forEach((doc) => newRows.push(doc.data()));
            setRows(newRows);
        });
    }, [game.id]);

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

  return (
    <Paper elevation={3} className={classes.root}>
        <Typography variant="h5" className={classes.subtitle}>Transaksjoner</Typography>
        <Paper elevation={0} variant="outlined" className={classes.table}>
        <TableContainer className={classes.container}>
            <Table classes={{stickyHeader: classes.stickyHeader}} stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.time}>
                    {columns.map((column) => {
                        const value = row[column.id];
                        return (
                        <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                        );
                    })}
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage="Rader per side"
            backIconButtonText="Forrige side"
            nextIconButtonText="Neste side"
        />
        </Paper>
    </Paper>
  );
}

TransactionsTable.propTypes = {
    game: PropTypes.object.isRequired,
};

export default TransactionsTable;