import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CenaZlota = () => {
  const [cenaZlota, setCenaZlota] = useState(null);
  const [historia, setHistoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://api.nbp.pl/api/cenyzlota/last/1/")
      .then(res => res.json())
      .then(data => setCenaZlota(data[0]))
      .catch(() => setError("Błąd pobierania aktualnej ceny złota"));

    fetch("https://api.nbp.pl/api/cenyzlota/last/30/")
      .then(res => res.json())
      .then(data => {
        setHistoria(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Błąd pobierania historii ceny złota");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!cenaZlota) return <p>Ładowanie aktualnej ceny złota...</p>;

  const chartData = {
    labels: historia.map(x => x.data),
    datasets: [
      {
        label: "Cena złota [PLN/g]",
        data: historia.map(x => x.cena),
        borderColor: "green",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Historia ceny złota - ostatnie 30 dni" },
    }
  };

  return (
    <div>
    <h2>Cena złota</h2>
      <p>
        <strong>Data:</strong> {cenaZlota.data} <br />
        <strong>Cena:</strong> {cenaZlota.cena} PLN/g
      </p>

      <hr />
        <div style={{ width: "500px", height: "250px" }}>
            <Line data={chartData} options={options} />
        </div>
    </div>
  );
};

export default CenaZlota;
