import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TabelaKursowa = () => {
  const [tabela, setTabela] = useState("A");
  const [kursy, setKursy] = useState([]);
  const [data, setData] = useState("");
  const [nrTabeli, setNrTabeli] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`https://api.nbp.pl/api/exchangerates/tables/${tabela}`)
      .then(response => response.json())
      .then(data => {
        setKursy(data[0].rates);
        setData(data[0].effectiveDate);
        setNrTabeli(data[0].no);
        setLoading(false);
      })
      .catch(error => {
        console.error("Błąd pobierania danych:", error);
        setLoading(false);
      });
  }, [tabela]);

  return (
    <div>
      <h2>Tabela kursowa NBP</h2>

      <label>
        Wybierz tabelę kursową:{" "}
        <select
          value={tabela}
          onChange={e => setTabela(e.target.value)}
        >
          <option value="A">Tabela A</option>
          <option value="B">Tabela B</option>
          <option value="C">Tabela C</option>
        </select>
      </label>

      <p>
        Numer tabeli: {nrTabeli} <br />
        Data obowiązywania: {data}
      </p>

      {loading ? (
        <p>Ładowanie danych...</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>LP</th>
              <th>Waluta</th>
              <th>Kod</th>
              <th>
                {tabela === "C"
                  ? "Kurs kupna waluty"
                  : "Kurs średni waluty"}
              </th>
              {tabela === "C" && <th>Kurs sprzedaży</th>}
            </tr>
          </thead>
          <tbody>
            {kursy.map((waluta, index) => (
             <tr key={waluta.code}>
                <td>{index + 1}</td>
                <td>
                    <Link to={`/tabela-kursowa/${waluta.code}?table=${tabela}`}>
                    {waluta.currency}
                    </Link>
                </td>
                <td>{waluta.code}</td>
                <td>
                    {tabela === "C" ? waluta.bid : waluta.mid}
                </td>
                    {tabela === "C" && <td>{waluta.ask}</td>}
                </tr>

            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TabelaKursowa;
