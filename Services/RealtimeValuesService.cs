using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading;
using System.Threading.Tasks;
using UNIREALCHAIN_React.Models;

namespace UNIREALCHAIN_React.Services
{
    public class RealtimeValuesService
    {
        private string _symbol;
        public string Symbol
        {
            get
            {
                return _symbol;
            }

            set
            {
                _symbol = value;
            }
        }
        private readonly BehaviorSubject<FinancialData> _values = new BehaviorSubject<FinancialData>(null);
        private IDisposable _disposable;

        public RealtimeValuesService(String sym, CancellationToken cancellationToken)
        {
            _disposable = Observable.Interval(TimeSpan.FromSeconds(2))
                    .Select(_ => Observable.FromAsync(async () => await GetFinancialData(sym, cancellationToken)))
                    .Concat()
                    .Subscribe(_values);
        }

        public async Task<FinancialData> GetModel(string url, HttpClient client, CancellationToken cancellationToken)
        {
            try
            {
                //GET Method  
                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<FinancialData>(apiResponse);
                    }
                    else
                    {
                        Console.WriteLine("Internal server Error");
                    }
                }
                return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        private async Task<FinancialData> GetFinancialData(string sym, CancellationToken cancellationToken)
        {
            try
            {
                FinancialData data;
                using (var httpClient = new HttpClient())
                {
                    // Was cancellation already requested?
                    if (cancellationToken.IsCancellationRequested)
                    {
                        /*cancellationToken.ThrowIfCancellationRequested();*/
                    }
                    httpClient.DefaultRequestHeaders.Accept.Clear();
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    //create the search tasks to be executed
                    var tasks = new[]{
                        GetModel("https://api.binance.com/api/v3/avgPrice?symbol=" + sym, httpClient, cancellationToken),
                        GetModel("https://api.binance.com/api/v3/ticker/24hr?symbol=" + sym, httpClient, cancellationToken),
    };

                    // Await the completion of all the running tasks. 
                    var responses = await Task.WhenAll(tasks); // returns IEmumerable<WalmartModel>

                    var results = responses.Where(r => r != null) ; //filter out any null values

                    var timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();

                    
                    data = results.Where(r => r.Symbol != null).FirstOrDefault<FinancialData>();
                    data.Price = results.Where(r => r.Symbol == null).FirstOrDefault<FinancialData>().Price;
                    data.Timestamp = timestamp;
                    Console.WriteLine(data);

                }
                return data;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public void remove()
        {
            _disposable.Dispose();
        }

       /* public void addSymbolToList(String sym)
        {
            if (!_symbolAPIMap.ContainsKey(sym))
            {
                _symbolAPIMap[sym] = 

                 ;
            }
        }*/

        public IObservable<FinancialData> Observe()
        {
            return _values;
        }
    }
}