using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UNIREALCHAIN_React.Services;

namespace UNIREALCHAIN_React.Helpers
{
    public class UserConnectionManager : IUserConnectionManager
    {
        private static Dictionary<string, List<string>> _symbolConnectionMap = new Dictionary<string, List<string>>();
        private static Dictionary<string, RealtimeValuesService> _symbolRealtimeServiceMap = new Dictionary<string, RealtimeValuesService>();
        private static string _userConnectionMapLocker = string.Empty;
        public Dictionary<string, RealtimeValuesService> RealtimeValuesService
        {
            get
            {
                return _symbolRealtimeServiceMap;
            }

        }
        public void KeepSymbolConnection(string symbol, string connectionId)
        {
            lock (_userConnectionMapLocker)
            {
                if (!_symbolConnectionMap.ContainsKey(symbol))
                {
                    _symbolConnectionMap[symbol] = new List<string>();
                }
                _symbolConnectionMap[symbol].Add(connectionId);
            }
        }

        public void SymbolUnmornitor(string connectionId, string symbol)
        {
            lock (_userConnectionMapLocker)
            {
                if (_symbolConnectionMap.ContainsKey(symbol))
                {
                    if (_symbolConnectionMap[symbol].Contains(connectionId))
                    {
                        _symbolConnectionMap[symbol].Remove(connectionId);
                        if (_symbolConnectionMap[symbol].Count == 0)
                        {
                            _symbolConnectionMap.Remove(symbol);
                            _symbolRealtimeServiceMap[symbol].remove();
                            _symbolRealtimeServiceMap.Remove(symbol);
                        }
                    }

                }
            }
        }
            public void RemoveSymbolConnection(string connectionId)
        {
            //Remove the connectionId of user 
            lock (_userConnectionMapLocker)
            {
                foreach (var symbol in _symbolConnectionMap.Keys)
                {
                    if (_symbolConnectionMap.ContainsKey(symbol))
                    {
                        if (_symbolConnectionMap[symbol].Contains(connectionId))
                        {
                            _symbolConnectionMap[symbol].Remove(connectionId);
                            if(_symbolConnectionMap[symbol].Count == 0)
                            {
                                _symbolConnectionMap.Remove(symbol);
                                _symbolRealtimeServiceMap[symbol].remove();
                                _symbolRealtimeServiceMap.Remove(symbol);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
}
