using System;
using System.Collections.Generic;
using System.Reactive.Linq;
using System.Reactive.Subjects;
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

        public RealtimeValuesService(String sym)
        {
            _disposable = Observable.Interval(TimeSpan.FromSeconds(1))
                    .Select(_ => (FinancialData)(new FinancialData()))
                    .Subscribe(_values);
        }
        public void dispose()
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