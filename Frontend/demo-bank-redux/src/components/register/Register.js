import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import alertify from "alertifyjs";


function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        NovaBank
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const jsonData = {};

    jsonData["first_name"] = data.get("firstName").toString().trim().replace(/\s+/g, " ");
    jsonData["last_name"] = data.get("lastName").toString().trim().replace(/\s+/g, " ");
    jsonData["email"] = data.get("email").toString().trim();
    jsonData["password"] = data.get("password").toString();

    const confirmPassword = data.get("confirmPassword").toString();

    const validName = (name) =>
      name.length >= 3 && /[A-Za-z]/.test(name) && /^[A-Za-z][A-Za-z '-]*$/.test(name);

    if (!validName(jsonData["first_name"]) || !validName(jsonData["last_name"])) {
      alertify.error("First and last names must be at least 3 alphabetic characters.");
      return;
    }

    console.log(jsonData, { confirm_password: confirmPassword });

    try {
      const apiUrl =
        "http://127.0.0.1:8070/register?confirm_password=" + confirmPassword;
      const response = await axios.post(apiUrl, jsonData, {
        headers: {
          "Content-Type": "application/json", // JSON verisi göndermek için content type ayarı
        },
      });

      if (response.status === 200) {
        alertify.success("Registration successful.");
        navigate("/");
      }

      console.log("Kullanıcı başarıyla kaydedildi:", response.data);
    } catch (error) {
      // İstek başarısız olduğunda hata işlemlerini burada yapabilirsiniz
      const backendMessage = error?.response?.data;
      if (Array.isArray(backendMessage)) {
        alertify.error(backendMessage.join(" | "));
      } else if (typeof backendMessage === "string") {
        alertify.error(backendMessage);
      } else {
        alertify.error("Registration failed.");
      }
      console.error("Kullanıcı kaydedilirken hata oluştu:", error);
    }

    

    
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#E69081" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 ,bgcolor: "#E69081"}}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavLink to="/">
                  Already have an account? Sign in
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
