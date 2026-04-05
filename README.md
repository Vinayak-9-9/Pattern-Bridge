# Stock Data Analyzer

Stock Data Analyzer is a beginner-friendly Python project that compares multiple stocks using real market data from Yahoo Finance.

## Project Overview
This project helps you practice basic financial data analysis with Python.
You enter ticker symbols (like `AAPL,MSFT,GOOG`), and the script:

- downloads 1 year of daily data
- builds a combined close-price table
- calculates daily returns
- computes a correlation matrix
- plots normalized price trends and a correlation heatmap

The goal is to learn analysis workflow, not to build a production trading system.

## Features
- Multi-ticker input from terminal (`AAPL,MSFT,GOOG` style)
- Invalid ticker handling with warning messages
- Combined close-price DataFrame for valid tickers
- Daily return calculation (% change)
- Correlation matrix of daily returns
- Normalized price comparison chart (all start at 100)
- Correlation heatmap for diversification intuition
- Clean, readable terminal output sections

## Installation
1. Open a terminal in this folder (`AI Project/Stock Data Analyzer`).
2. (Optional but recommended) Create and activate a virtual environment.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Example Usage
Run the script:

```bash
python main.py
```

When prompted, enter comma-separated tickers:

```txt
AAPL,MSFT,GOOG
```

The script will then print summary tables and open charts.

## Financial Concepts Used (Beginner Version)
- **Ticker Symbol**
  - A short market code for a company (example: `AAPL` for Apple).

- **Close Price**
  - The final traded price for a stock on a trading day.

- **Daily Return (%)**
  - Day-to-day percentage change in close price.
  - Formula: `(today_close / yesterday_close - 1) * 100`.

- **Normalized Price**
  - Rescales each stock to start at 100 on the first date.
  - Useful for comparing relative growth across stocks with different price levels.

- **Correlation**
  - Measures how similarly two stocks move.
  - `+1`: move together strongly, `0`: weak linear relationship, `-1`: move in opposite directions.

- **Diversification (basic idea)**
  - Combining lower-correlated stocks can reduce overall portfolio risk.

## Project Structure

```txt
Stock Data Analyzer/
├── main.py           # Main script: input, download, calculations, charts
├── requirements.txt  # Python dependencies
└── README.md         # Project documentation
```

## What I Learned Building This
- How to collect market data programmatically with `yfinance`
- How to combine and align multiple stock time series using `pandas`
- How to compute daily returns and interpret correlation
- How to visualize time series and heatmaps with `matplotlib`
- How to structure a small analysis script into clear helper functions

## Notes
- This is an educational project, not financial advice.
- Market data availability depends on Yahoo Finance responses and network access.
