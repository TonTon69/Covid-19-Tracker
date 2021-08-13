import CountrySelector from "./components/CountrySelector/index";
import Highlight from "./components/Highlight/index";
import Summary from "./components/Summary/index";
import { useState, useEffect } from "react";
import { getCountries, getReportByCountry } from "./api/index";
import { Container, Typography } from "@material-ui/core";
import { sortBy } from "lodash";
import moment from "moment";
import "moment/locale/vi";
import "@fontsource/roboto";

moment.locale("vi");

function App() {
    const [countries, setCountries] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState(""); //lưu trữ country hiện tại mà user chọn
    const [report, setReport] = useState([]);

    useEffect(() => {
        getCountries().then((res) => {
            console.log("getCountries", { res });
            const countries = sortBy(res.data, "Country");
            setCountries(countries);
            //load trang thì hiển thị thông tin của VN đầu tiên
            setSelectedCountryId("vn");
        });
    }, []);

    const handleOnChange = (e) => {
        setSelectedCountryId(e.target.value);
    };

    useEffect(() => {
        if (selectedCountryId) {
            const { Slug } = countries.find(
                (country) => country.ISO2.toLowerCase() === selectedCountryId
            );
            //call api
            getReportByCountry(Slug).then((res) => {
                console.log("getReportByCountry", { res });
                //xóa item cuối cùng
                res.data.pop();
                setReport(res.data);
            });
        }
    }, [countries, selectedCountryId]);

    return (
        <Container style={{ marginTop: 20 }}>
            <Typography variant="h2" component="h2">
                SỐ LIỆU COVID-19
            </Typography>
            <Typography>{moment().format("LLL")}</Typography>
            <CountrySelector
                countries={countries}
                handleOnChange={handleOnChange}
                value={selectedCountryId}
            />
            <Highlight report={report} />
            <Summary report={report} />
        </Container>
    );
}

export default App;
