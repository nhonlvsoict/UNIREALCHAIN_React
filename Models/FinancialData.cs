using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UNIREALCHAIN_React.Models
{
    public class FinancialData
    {
        public FinancialData(string symbol)
        {
            Symbol = symbol;
        }
        public FinancialData() { }

        [JsonConstructor]
        public FinancialData(string symbol, double price, double priceChange, double priceChangePercent, double volume, double quoteVolume, double lastPrice, double lastQty)
        {
            Symbol = symbol;
            Price = price;
            PriceChange = priceChange;
            PriceChangePercent = priceChangePercent;
            Volume = volume;
            QuoteVolume = quoteVolume;
            LastPrice = lastPrice;
            LastQty = lastQty;
        }

        




        public string Symbol { get; set; }
        public double Price { get; set; }
        public double PriceChange { get; set; }
        public double PriceChangePercent { get; set; }
        public double Volume { get; set; }
        public double QuoteVolume { get; set; }
        public double LastPrice { get; set; }
        public double LastQty { get; set; }

        public long Timestamp { get; set; }
    }
}
