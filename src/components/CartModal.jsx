import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Avatar,
  Typography,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const CartModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const rowsPerPage = 5;

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(removeFromCart(deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const filteredItems = useMemo(() => {
    let items = [...cartItems];
    if (search.trim() !== "") {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (orderBy) {
      items.sort((a, b) => {
        let aValue, bValue;
        if (orderBy === "total") {
          aValue = a.price * a.quantity;
          bValue = b.price * b.quantity;
        } else {
          aValue = a[orderBy];
          bValue = b[orderBy];
        }
        if (typeof aValue === "string") {
          return order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return order === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
    return items;
  }, [cartItems, search, orderBy, order]);

  const paginatedItems = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [filteredItems, page]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{ fontSize: { xs: "1rem", sm: "1.3rem", md: "1.5rem" } }}
        >
          Cart Items
        </DialogTitle>
        <DialogContent sx={{ maxHeight: "700px" }}>
          {cartItems.length === 0 ? (
            <Box textAlign="center" py={4} fontSize={{ xs: 14, sm: 16 }}>
              No items in cart.
            </Box>
          ) : (
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 } }}>
              <Box
                mb={2}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={1}
              >
                <TextField
                  size="small"
                  placeholder="Search Products..."
                  value={search}
                  fullWidth
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                />
              </Box>

              <Box sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        Image
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        Product
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        <TableSortLabel
                          active={orderBy === "price"}
                          direction={orderBy === "price" ? order : "asc"}
                          onClick={() => handleSort("price")}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        <TableSortLabel
                          active={orderBy === "quantity"}
                          direction={orderBy === "quantity" ? order : "asc"}
                          onClick={() => handleSort("quantity")}
                        >
                          Quantity
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        <TableSortLabel
                          active={orderBy === "total"}
                          direction={orderBy === "total" ? order : "asc"}
                          onClick={() => handleSort("total")}
                        >
                          Total
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: 14, sm: 16 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                      >
                        <TableCell>
                          <Avatar
                            variant="square"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: { xs: 40, sm: 60 },
                              height: { xs: 40, sm: 60 },
                              borderRadius: 2,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: 12, sm: 14 } }}>
                          {item.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: 12, sm: 15 } }}>
                          {item.description}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: 12, sm: 14 } }}>
                          ${item.price}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                dispatch(decreaseQuantity(item.id))
                              }
                            >
                              -
                            </Button>
                            <Typography
                              sx={{
                                minWidth: 20,
                                textAlign: "center",
                                fontSize: { xs: 12, sm: 14 },
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => dispatch(increaseQuantity(item))}
                            >
                              +
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: 12, sm: 14 } }}>
                          ${item.price * item.quantity}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteClick(item.id)}
                            size="small"
                          >
                            <DeleteIcon color="error" fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 1,
                }}
              >
                <TablePagination
                  component="div"
                  count={filteredItems.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  labelRowsPerPage=""
                  sx={{
                    "& .MuiTablePagination-spacer": { display: "none" },
                    "& .MuiTablePagination-actions": {
                      justifyContent: { xs: "center", sm: "flex-end" },
                    },
                  }}
                />
              </Box>
            </Paper>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            minWidth: { xs: 280, sm: 360, md: 400 },
            maxWidth: { xs: 300, sm: 420, md: 480 },
            textAlign: "center",
          },
        }}
      >
        <WarningAmberIcon
          sx={{
            fontSize: { xs: 40, sm: 50, md: 60 },
            color: "warning.main",
            mx: "auto",
            mt: { xs: 1, sm: 2 },
          }}
        />
        <DialogTitle sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, mt: 1 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent
          sx={{
            fontSize: { xs: 16, sm: 18, md: 20 },
            mt: 1,
            px: { xs: 1, sm: 2 },
          }}
        >
          Are you sure you want to remove this item from the cart?
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
            pb: { xs: 2, sm: 3 },
          }}
        >
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ px: { xs: 4, sm: 5 }, width: { xs: "100%", sm: "auto" } }}
          >
            Delete
          </Button>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            color="primary"
            sx={{ px: { xs: 4, sm: 5 }, width: { xs: "100%", sm: "auto" } }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartModal;
