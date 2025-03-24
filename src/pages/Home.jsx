import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { Select, Spin, Typography, Row, Col } from "antd";
import { motion } from "framer-motion";
import { WiDaySunny, WiCloud, WiRain, WiSnow } from "react-icons/wi";

const { Title, Text } = Typography;
const { Option } = Select;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: 100vh;
`;

const SelectGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
`;

const WeatherCard = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  transition: 0.3s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const daysUz = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

const uzbRegions = {
  "Toshkent viloyati": {
    "Toshkent sh": { lat: 41.31, lon: 69.26 },
    Chirchiq: { lat: 41.47, lon: 69.58 },
    "Yangiyo‘l": { lat: 41.11, lon: 69.03 },
    Bekobod: { lat: 40.22, lon: 69.27 },
  },
  "Namangan viloyati": {
    "Namangan sh": { lat: 40.9983, lon: 71.6726 },
    Chortoq: { lat: 41.075, lon: 71.83 },
    Pop: { lat: 41.03, lon: 71.11 },
    "To‘raqo‘rg‘on": { lat: 41.01, lon: 71.25 },
  },
  "Andijon viloyati": {
    "Andijon sh": { lat: 40.7821, lon: 72.3442 },
    "Xo‘jaobod": { lat: 40.65, lon: 72.6 },
    Asaka: { lat: 40.64, lon: 72.24 },
  },
  "Farg‘ona viloyati": {
    "Farg‘ona sh": { lat: 40.3894, lon: 71.7878 },
    "Qo‘qon": { lat: 40.53, lon: 70.94 },
    "Marg‘ilon": { lat: 40.47, lon: 71.72 },
  },
  "Samarqand viloyati": {
    "Samarqand sh": { lat: 39.65, lon: 66.96 },
    "Kattaqo‘rg‘on": { lat: 39.9, lon: 65.85 },
  },
  "Buxoro viloyati": {
    "Buxoro sh": { lat: 39.77, lon: 64.43 },
  },
  "Qashqadaryo viloyati": {
    "Qarshi sh": { lat: 38.861, lon: 65.78 },
  },
  "Xorazm viloyati": {
    "Urganch sh": { lat: 41.55, lon: 60.63 },
    Xiva: { lat: 41.38, lon: 60.36 },
  },
  "Surxondaryo viloyati": {
    "Termiz sh": { lat: 37.22, lon: 67.28 },
  },
  "Jizzax viloyati": {
    "Jizzax sh": { lat: 40.12, lon: 67.83 },
  },
  "Navoiy viloyati": {
    "Navoiy sh": { lat: 40.09, lon: 65.37 },
  },
  "Sirdaryo viloyati": {
    "Guliston sh": { lat: 40.49, lon: 68.78 },
  },
  "Qoraqalpog‘iston": {
    "Nukus sh": { lat: 42.45, lon: 59.61 },
  },
};

export default function Home() {
  const [region, setRegion] = useState("Namangan viloyati");
  const [city, setCity] = useState("Namangan sh");

  // Auto-update tumanni
  useEffect(() => {
    if (region) {
      const firstCity = Object.keys(uzbRegions[region])[0];
      setCity(firstCity);
    }
  }, [region]);

  const selectedCityCoords = city ? uzbRegions[region][city] : null;

  const { data, isLoading } = useQuery({
    queryKey: ["weather", selectedCityCoords],
    queryFn: async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCityCoords.lat}&longitude=${selectedCityCoords.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&timezone=auto`
      );
      return res.json();
    },
    enabled: !!selectedCityCoords,
  });

  return (
    <Wrapper>
      <Title style={{ color: "#fff", marginBottom: "10px" }}>
        O‘zbekiston ob-havo prognozi
      </Title>

      <SelectGroup>
        <Select value={region} onChange={setRegion} style={{ width: 200 }}>
          {Object.keys(uzbRegions).map((r) => (
            <Option key={r} value={r}>
              {r}
            </Option>
          ))}
        </Select>

        <Select
          value={city}
          onChange={setCity}
          style={{ width: 200 }}
          disabled={!region}
        >
          {region &&
            Object.keys(uzbRegions[region]).map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
        </Select>
      </SelectGroup>

      {isLoading && selectedCityCoords && <Spin size="large" />}

      {data && (
        <Row gutter={[16, 16]} style={{ maxWidth: "900px", width: "100%" }}>
          {data?.daily?.time.map((day, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <WeatherCard
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                {getIcon(data.daily.weathercode[idx])}
                <Title level={4}>{daysUz[new Date(day).getDay()]}</Title>
                <Text>{day}</Text>
                <br />
                <Text strong style={{ fontSize: "18px" }}>
                  🌡️ {data.daily.temperature_2m_max[idx]}° /{" "}
                  {data.daily.temperature_2m_min[idx]}°
                </Text>
                <br />
                <Text>💧 Yog‘in: {data.daily.precipitation_sum[idx]} mm</Text>
                <br />
                <Text>💨 Shamol: {data.daily.windspeed_10m_max[idx]} km/h</Text>
              </WeatherCard>
            </Col>
          ))}
        </Row>
      )}
    </Wrapper>
  );
}

function getIcon(code) {
  if (code === 0) return <WiDaySunny size={50} />;
  if (code < 50) return <WiCloud size={50} />;
  if (code < 70) return <WiRain size={50} />;
  return <WiSnow size={50} />;
}
