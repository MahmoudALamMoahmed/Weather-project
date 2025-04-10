import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//Material Ui Components
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

import "moment/min/locales";

moment.locale("ar");
const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;
function App() {
  /* console.log("rendring the componenting"); */
  /*  console.log(dateAndTime); */
  const { t, i18n } = useTranslation();

  /* States */
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale, setLocale] = useState("ar");
  //Envents Handlers
  function handleLanguageClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");

      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("MMMM Do YYYY h:mm:ss a"));
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
  useEffect(() => {
    setDateAndTime(moment().format("MMMM Do YYYY h:mm:ss a"));
    // Make a request for a user with a given ID
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=05aa483ecc47aacec12b96d5cb4b2abd",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        const resonseTemp = Math.round(response.data.main.temp - 272.15);

        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);

        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;

        setTemp({
          number: resonseTemp,
          description: description,
          min: min,
          max: max,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
        console.log(min, max, description);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => {
      console.log("canceling");

      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* Content Container to center card */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* Start Card */}
            <div
              dir="rtl"
              style={{
                backgroundColor: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
                width: "100%",
              }}
            >
              {/* Content */}
              <div>
                {/* City & Time */}
                <div
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                >
                  <Typography variant="h2" style={{ marginRight: "20px" }}>
                    {t("Egypt")}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/* City & Time */}
                <hr />
                {/* Container of degree + Cloud Icon */}
                <div
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {/* Degree & Description */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Temp */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1">{temp.number}</Typography>
                      <img src={temp.icon} alt="Description" />
                    </div>
                    {/* Temp */}
                    <Typography variant="h6">{t(temp.description)}</Typography>
                    {/* Min & Max */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("min")} : {temp.min}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}> | </h5>
                      <h5>
                        {t("max")} : {temp.max}
                      </h5>
                    </div>
                  </div>
                  {/* Degree & Description */}
                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
                {/* Container of degree + Cloud Icon */}
              </div>
              {/* Content */}
            </div>
            {/* End Card */}

            {/*Translation  */}
            <div
              dir="ltr"
              style={{
                width: "100%",
                display: "flex",
                marginTop: "20px",
                /* justifyContent: "start", */
              }}
            >
              <Button
                variant="text"
                style={{ color: "white" }}
                onClick={handleLanguageClick}
              >
                {locale === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
            {/*Translation  */}
          </div>
          {/* Content Container to center card */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
