import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";
import { Upload, Database, TrendingUp, FileSpreadsheet } from "lucide-react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const lines = e.target.result.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());

      const rows = lines.slice(1).map(line => {
        const values = line.split(",");
        return Object.fromEntries(
          headers.map((header, i) => [
            header,
            values[i]?.trim()
          ])
        );
      });

      setColumns(headers);
      setData(rows);
    };

    reader.readAsText(file);
  };

  const numericColumns = columns.filter(col =>
    data.some(row => !isNaN(Number(row[col])) && row[col] !== "")
  );

  const chartData = numericColumns.length
    ? data.slice(0, 10).map((row, index) => ({
        name: `Row ${index + 1}`,
        value: Number(row[numericColumns[0]])
      }))
    : [];

  return (
    <div className="app">

      <aside className="sidebar">
        <h2>📊 DataAnalytics</h2>
        <p className="menu-title">MAIN MENU</p>
        <p className="active">Dashboard</p>
        <p>Data Analysis</p>
        <p>Visualizations</p>
        <p>Reports</p>
      </aside>

      <main className="main">

        <header>
          <div>
            <h1>AI Data Analytics Platform</h1>
            <p>Analyze, visualize and understand your data.</p>
          </div>
          <span className="status">● System Online</span>
        </header>

        <section className="welcome">
          <h2>Welcome to your Analytics Dashboard 👋</h2>
          <p>Upload your dataset to start exploring your data.</p>
        </section>

        <section className="cards">

          <div className="card">
            <Database />
            <h3>Total Records</h3>
            <h2>{data.length}</h2>
          </div>

          <div className="card">
            <FileSpreadsheet />
            <h3>Total Columns</h3>
            <h2>{columns.length}</h2>
          </div>

          <div className="card">
            <TrendingUp />
            <h3>Numeric Columns</h3>
            <h2>{numericColumns.length}</h2>
          </div>

        </section>

        <section className="upload-box">
          <Upload size={35} />
          <h2>Upload Your Dataset</h2>
          <p>Select a CSV file to begin your analysis.</p>

          <label className="upload-btn">
            Choose CSV File
            <input
              type="file"
              accept=".csv"
              onChange={handleUpload}
              hidden
            />
          </label>

          {fileName && <p>Uploaded: {fileName}</p>}
        </section>

        {data.length > 0 && (
          <>
            <section className="panel">
              <h2>Dataset Preview</h2>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {columns.map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        {columns.map(col => (
                          <td key={col}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <h2>Data Visualization</h2>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No numeric data available for visualization.</p>
              )}
            </section>

            <section className="panel">
              <h2>Basic Data Insights</h2>
              <p>Total records: {data.length}</p>
              <p>Total columns: {columns.length}</p>
              <p>Numeric columns: {numericColumns.length}</p>
              <p>Dataset size: {fileName}</p>
            </section>
          </>
        )}

      </main>
    </div>
  );
}

export default App;