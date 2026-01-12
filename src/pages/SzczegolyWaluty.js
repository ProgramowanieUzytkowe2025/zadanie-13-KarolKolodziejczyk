import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const SzczegolyWaluty = () => {
  const { waluta } = useParams();
  const location = useLocation();
  const getToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
    };
  const queryParams = new URLSearchParams(location.search);
  const table = queryParams.get("table") || "A";

  const [dane, setDane] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kwota, setKwota] = useState("");
  const [data, setData] = useState(getToday());
  const [wynik, setWynik] = useState(null);



  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://api.nbp.pl/api/exchangerates/rates/${table}/${waluta}/`)
      .then(response => {
        if (!response.ok) throw new Error("Błąd pobierania danych");
        return response.json();
      })
      .then(data => {
        setDane(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Nie znaleziono takiej waluty.");
        setLoading(false);
      });
  }, [waluta, table]);

  const przeliczWalute = async (e) => {
  e.preventDefault();
  setWynik(null);
  setError(null);

  let dateToFetch = data || ""; 
  let url = "";

    try {
        let response, kursData;

        if (!dateToFetch) {
        url = `https://api.nbp.pl/api/exchangerates/rates/${table}/${waluta}`;
        response = await fetch(url);
        if (!response.ok) throw new Error("Błąd pobierania kursu");
        kursData = await response.json();
        } else {
        let currentDate = new Date(dateToFetch);

        while (true) {
            const yyyy = currentDate.getFullYear();
            const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
            const dd = String(currentDate.getDate()).padStart(2, "0");
            const dateStr = `${yyyy}-${mm}-${dd}`;

            url = `https://api.nbp.pl/api/exchangerates/rates/${table}/${waluta}/${dateStr}`;
            response = await fetch(url);

            if (response.ok) {
            kursData = await response.json();
            break; 
            }

            currentDate.setDate(currentDate.getDate() - 1);
        }
        }

        let kurs = table === "C" ? kursData.rates[0].bid : kursData.rates[0].mid;
        const wartoscPLN = kwota ? kwota * kurs : null;

        setWynik({
        kurs,
        wartosc: wartoscPLN,
        dataKursu: kursData.rates[0].effectiveDate
        });
    } catch (err) {
        setError("Nie można pobrać kursu dla wybranej daty.");
    }
    };  


  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Szczegóły waluty</h2>

      <p>
        <strong>Nazwa waluty:</strong> {dane.currency} <br />
        <strong>Aktualny kurs:</strong>{" "}
        {table === "C" ? dane.rates[0].bid : dane.rates[0].mid} PLN
      </p>

      <hr />

      <h3>Przelicz walutę</h3>

      <form onSubmit={przeliczWalute}>
        <table border="0" cellPadding="5">
          <tbody>
            <tr>
              <td>Kwota:</td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={kwota}
                  onChange={e => setKwota(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Data (opcjonalnie):</td>
              <td>
                <input
                  type="date"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <button type="submit">Przelicz</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {wynik && (
        <p style={{ marginTop: "10px" }}>
          <strong>Kurs z dnia {wynik.dataKursu}:</strong> {wynik.kurs} PLN <br />
          {kwota && <><strong>Wartość w PLN:</strong> {wynik.wartosc} PLN</>}
        </p>
      )}
    </div>
  );
};

export default SzczegolyWaluty;
