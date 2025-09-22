import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import CartModal from "./CartModal";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Pagination,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import products from "../productsdetails/Products.jsx";

const ProductList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const displayedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const getCartQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        background: "linear-gradient(to right, #fbc2eb, #a6c1ee)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#6a1b9a",
          borderRadius: "12px",
          padding: { xs: "8px 12px", sm: "12px 20px" },
          mb: 4,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="white"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.3rem",
              md: "1.8rem",
              lg: "2.2rem",
            },
          }}
        >
          Product List
        </Typography>
        <IconButton onClick={() => setOpen(true)}>
          <Badge badgeContent={cartItems.length} color="secondary">
            <ShoppingCartIcon fontSize="large" sx={{ color: "white" }} />
          </Badge>
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
        }}
      >
        {displayedProducts.map((product) => {
          const quantity = getCartQuantity(product.id);

          return (
            <Card
              key={product.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.03)" },
                boxShadow: "0px 6px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                  height: { xs: 160, sm: 180, md: 200, lg: 220 },
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    mb: 0.5,
                  }}
                  noWrap
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1rem" },
                  }}
                  noWrap
                >
                  {product.description}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="#6a1b9a"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.2rem" } }}
                >
                  ${product.price}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "center", paddingBottom: "18px"}}>
                {quantity > 0 ? (
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
                      onClick={() => dispatch(decreaseQuantity(product.id))}
                    >
                      -
                    </Button>
                    <Typography sx={{ minWidth: 20, textAlign: "center" }}>
                      {quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => dispatch(increaseQuantity(product.id))}
                    >
                      +
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#6a1b9a",
                      "&:hover": { backgroundColor: "#4a148c" },
                    }}
                    onClick={() => dispatch(addToCart(product))}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardActions>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
        />
      </Box>

      <CartModal open={open} setOpen={setOpen} />
    </Box>
  );
};

export default ProductList;
